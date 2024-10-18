use crate::indexer::{
    ClientId, ClobPairId, Height, OrderExecution, OrderFlags, OrderType, PerpetualMarket, Price,
    Quantity, Subaccount,
};
use anyhow::{anyhow as err, Error};
use bigdecimal::{num_traits::cast::ToPrimitive, BigDecimal, One};
use chrono::{DateTime, Utc};
use derive_more::From;
pub use v4_proto_rs::dydxprotocol::clob::{
    order::{Side as OrderSide, TimeInForce as OrderTimeInForce},
    OrderId,
};
use v4_proto_rs::dydxprotocol::{
    clob::{
        msg_cancel_order,
        order::{self, ConditionType},
        Order,
    },
    subaccounts::SubaccountId,
};

/// Maximum short-term orders lifetime.
///
/// See also [short-term vs long-term orders](https://help.dydx.trade/en/articles/166985-short-term-vs-long-term-order-types).
pub const SHORT_TERM_ORDER_MAXIMUM_LIFETIME: u32 = 20;

/// Value used to identify the Rust client.
pub const DEFAULT_RUST_CLIENT_METADATA: u32 = 4;

/// Order [expirations](https://docs.dydx.exchange/api_integration-trading/short_term_vs_stateful).
#[derive(From, Clone, Debug)]
pub enum OrderGoodUntil {
    /// Block expiratin is used for short-term orders.
    Block(Height),
    /// Time expiratin is used for long-term orders.
    Time(DateTime<Utc>),
}

impl TryFrom<OrderGoodUntil> for order::GoodTilOneof {
    type Error = Error;
    fn try_from(until: OrderGoodUntil) -> Result<Self, Error> {
        match until {
            OrderGoodUntil::Block(height) => Ok(Self::GoodTilBlock(height.0)),
            OrderGoodUntil::Time(time) => Ok(Self::GoodTilBlockTime(time.timestamp().try_into()?)),
        }
    }
}

impl TryFrom<OrderGoodUntil> for msg_cancel_order::GoodTilOneof {
    type Error = Error;
    fn try_from(until: OrderGoodUntil) -> Result<Self, Error> {
        match until {
            OrderGoodUntil::Block(height) => Ok(Self::GoodTilBlock(height.0)),
            OrderGoodUntil::Time(time) => Ok(Self::GoodTilBlockTime(time.timestamp().try_into()?)),
        }
    }
}

/// Market parameters required to perform price and size quantizations.
/// These quantizations are required for `Order` placement.
///
/// See also [how to interpret block data for trades](https://docs.dydx.exchange/api_integration-guides/how_to_interpret_block_data_for_trades).
#[derive(Clone, Debug)]
pub struct OrderMarketParams {
    /// Atomic resolution
    pub atomic_resolution: i32,
    /// Clob pair id.
    pub clob_pair_id: ClobPairId,
    /// Oracle price.
    pub oracle_price: Option<Price>,
    /// Quantum conversion exponent.
    pub quantum_conversion_exponent: i32,
    /// Step base quantums.
    pub step_base_quantums: u64,
    /// Subticks per tick.
    pub subticks_per_tick: u32,
}

impl OrderMarketParams {
    /// Convert price into subticks.
    pub fn quantize_price(&self, price: impl Into<Price>) -> BigDecimal {
        const QUOTE_QUANTUMS_ATOMIC_RESOLUTION: i32 = -6;
        let scale = -(self.atomic_resolution
            - self.quantum_conversion_exponent
            - QUOTE_QUANTUMS_ATOMIC_RESOLUTION);
        let factor = BigDecimal::new(One::one(), scale.into());
        let raw_subticks = price.into().0 * factor;
        let subticks_per_tick = BigDecimal::from(self.subticks_per_tick);
        let quantums = quantize(&raw_subticks, &subticks_per_tick);
        quantums.max(subticks_per_tick)
    }

    /// Convert decimal into quantums.
    pub fn quantize_quantity(&self, quantity: impl Into<Quantity>) -> BigDecimal {
        let factor = BigDecimal::new(One::one(), self.atomic_resolution.into());
        let raw_quantums = quantity.into().0 * factor;
        let step_base_quantums = BigDecimal::from(self.step_base_quantums);
        let quantums = quantize(&raw_quantums, &step_base_quantums);
        quantums.max(step_base_quantums)
    }

    /// Convert subticks into decimal.
    pub fn dequantize_subticks(&self, subticks: impl Into<BigDecimal>) -> BigDecimal {
        const QUOTE_QUANTUMS_ATOMIC_RESOLUTION: i32 = -6;
        let scale = -(self.atomic_resolution
            - self.quantum_conversion_exponent
            - QUOTE_QUANTUMS_ATOMIC_RESOLUTION);
        let factor = BigDecimal::new(One::one(), scale.into());
        subticks.into() / factor
    }

    /// Convert quantums into decimal.
    pub fn dequantize_quantums(&self, quantums: impl Into<BigDecimal>) -> BigDecimal {
        let factor = BigDecimal::new(One::one(), self.atomic_resolution.into());
        quantums.into() / factor
    }

    /// Get orderbook pair id.
    pub fn clob_pair_id(&self) -> &ClobPairId {
        &self.clob_pair_id
    }
}

/// A `round`-line function that quantize a `value` to the `fraction`.
fn quantize(value: &BigDecimal, fraction: &BigDecimal) -> BigDecimal {
    (value / fraction).round(0) * fraction
}

impl From<PerpetualMarket> for OrderMarketParams {
    fn from(market: PerpetualMarket) -> Self {
        Self {
            atomic_resolution: market.atomic_resolution,
            clob_pair_id: market.clob_pair_id,
            oracle_price: market.oracle_price,
            quantum_conversion_exponent: market.quantum_conversion_exponent,
            step_base_quantums: market.step_base_quantums,
            subticks_per_tick: market.subticks_per_tick,
        }
    }
}

/// [`Order`] builder.
///
/// Note that the price input to the `OrderBuilder` is in the "common" units of the perpetual/currency, not the quantized/atomic value.
///
/// Two main classes of orders in dYdX from persistence perspective are
/// [short-term and long-term (stateful) orders](https://docs.dydx.exchange/api_integration-trading/short_term_vs_stateful).
///
/// For different types of orders
/// see also [Stop-Limit Versus Stop-Loss](https://dydx.exchange/crypto-learning/stop-limit-versus-stop-loss) and
/// [Perpetual order types on dYdX Chain](https://help.dydx.trade/en/articles/166981-perpetual-order-types-on-dydx-chain).
#[derive(Clone, Debug)]
pub struct OrderBuilder {
    market_params: OrderMarketParams,
    #[allow(dead_code)] // TODO remove after completion
    subaccount_id: SubaccountId,
    flags: OrderFlags,
    side: Option<OrderSide>,
    ty: Option<OrderType>,
    size: Option<Quantity>,
    price: Option<Price>,
    time_in_force: Option<OrderTimeInForce>,
    reduce_only: Option<bool>,
    until: Option<OrderGoodUntil>,
    post_only: Option<bool>,
    execution: Option<OrderExecution>,
    trigger_price: Option<Price>,
    slippage: BigDecimal,
}

impl OrderBuilder {
    /// Create a new [`Order`] builder.
    pub fn new(market_for: impl Into<OrderMarketParams>, subaccount: Subaccount) -> Self {
        Self {
            market_params: market_for.into(),
            subaccount_id: subaccount.into(),
            flags: OrderFlags::ShortTerm,
            side: Some(OrderSide::Buy),
            ty: Some(OrderType::Market),
            size: None,
            price: None,
            time_in_force: None,
            reduce_only: None,
            until: None,
            post_only: None,
            execution: None,
            trigger_price: None,
            slippage: BigDecimal::new(5.into(), 2),
        }
    }

    /// Set as Market order.
    ///
    ///  An instruction to immediately buy or sell an asset at the best available price when the order is placed.
    pub fn market(mut self, side: impl Into<OrderSide>, size: impl Into<Quantity>) -> Self {
        self.ty = Some(OrderType::Market);
        self.side = Some(side.into());
        self.size = Some(size.into());
        self
    }

    /// Set as Limit order.
    ///
    /// With a limit order, a trader specifies the price at which they’re willing to buy or sell an asset.
    /// Unlike market orders, limit orders don’t go into effect until the market price hits a trader’s “limit price.”
    pub fn limit(
        mut self,
        side: impl Into<OrderSide>,
        price: impl Into<Price>,
        size: impl Into<Quantity>,
    ) -> Self {
        self.ty = Some(OrderType::Limit);
        self.price = Some(price.into());
        self.side = Some(side.into());
        self.size = Some(size.into());
        self
    }

    /// Set as Stop Limit order
    ///
    /// Stop-limit orders use a stop `trigger_price` and a limit `price` to give investors greater control over their trades.
    /// When setting up a stop-limit order, traders set a `trigger_price` when their order enters the market
    /// and a limit `price` when they want the order to execute.
    pub fn stop_limit(
        mut self,
        side: impl Into<OrderSide>,
        price: impl Into<Price>,
        trigger_price: impl Into<Price>,
        size: impl Into<Quantity>,
    ) -> Self {
        self.ty = Some(OrderType::StopLimit);
        self.price = Some(price.into());
        self.trigger_price = Some(trigger_price.into());
        self.side = Some(side.into());
        self.size = Some(size.into());
        self.conditional()
    }

    /// Set as Stop Market order.
    ///
    /// When using a stop order, the trader sets a `trigger_price` to trigger a buy or sell order on their exchange.
    /// The moment that condition is met, it triggers a market order executed at the current market price.
    /// This means that, unlike limit orders, the execution price of a stop order may be different from the price set by the trader.
    pub fn stop_market(
        mut self,
        side: impl Into<OrderSide>,
        trigger_price: impl Into<Price>,
        size: impl Into<Quantity>,
    ) -> Self {
        self.ty = Some(OrderType::StopMarket);
        self.trigger_price = Some(trigger_price.into());
        self.side = Some(side.into());
        self.size = Some(size.into());
        self.conditional()
    }

    /// Set as Take Profit Limit order.
    ///
    /// The order enters in force if the price reaches `trigger_price` and is executed at `price` after that.
    pub fn take_profit_limit(
        mut self,
        side: impl Into<OrderSide>,
        price: impl Into<Price>,
        trigger_price: impl Into<Price>,
        size: impl Into<Quantity>,
    ) -> Self {
        self.ty = Some(OrderType::TakeProfit);
        self.price = Some(price.into());
        self.trigger_price = Some(trigger_price.into());
        self.side = Some(side.into());
        self.size = Some(size.into());
        self.conditional()
    }

    /// Set as Take Profit Market order.
    ///
    /// The order enters in force if the price reaches `trigger_price` and converst to an ordinary market order,
    /// i.e. it is executed at the best available market price.
    pub fn take_profit_market(
        mut self,
        side: impl Into<OrderSide>,
        trigger_price: impl Into<Price>,
        size: impl Into<Quantity>,
    ) -> Self {
        self.ty = Some(OrderType::TakeProfitMarket);
        self.trigger_price = Some(trigger_price.into());
        self.side = Some(side.into());
        self.size = Some(size.into());
        self.conditional()
    }

    /// Set order as a long-term.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/place_order_long_term.rs).
    pub fn long_term(mut self) -> Self {
        self.flags = OrderFlags::LongTerm;
        self
    }

    /// Set order as a short-term.
    ///
    /// Check [the example](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-rs/client/examples/place_order_short_term.rs).
    pub fn short_term(mut self) -> Self {
        self.flags = OrderFlags::ShortTerm;
        self
    }

    /// Set order as a conditional, triggered using `trigger_price`.
    pub fn conditional(mut self) -> Self {
        self.flags = OrderFlags::Conditional;
        self
    }

    /* Single setters */
    /// Set the limit price for Limit orders (and related types),
    /// or the up-to allowed price for Market orders (and related types).
    pub fn price(mut self, price: impl Into<Price>) -> Self {
        self.price = Some(price.into());
        self
    }

    /// [Position size](https://dydx.exchange/crypto-learning/glossary?#total-order-size).
    pub fn size(mut self, size: impl Into<Quantity>) -> Self {
        self.size = Some(size.into());
        self
    }

    /// Set [time execution options](https://docs.dydx.exchange/api_integration-trading/order_types#time-in-force).
    ///
    /// Basically, it places of the order in the range between being
    /// a Taker order and a Maker order.
    ///
    /// `IOC` (Taker) <---> `Unspecified` (Taker/Maker) <---> `Post` (Maker).
    ///
    /// See also [Market Makers vs Market Takers](https://dydx.exchange/crypto-learning/market-makers-vs-market-takers).
    pub fn time_in_force(mut self, tif: impl Into<OrderTimeInForce>) -> Self {
        self.time_in_force = Some(tif.into());
        self
    }

    /// Set an order as [reduce-only](https://docs.dydx.exchange/api_integration-trading/order_types#reduce-only-order-ro).
    pub fn reduce_only(mut self, reduce: impl Into<bool>) -> Self {
        self.reduce_only = Some(reduce.into());
        self
    }

    /// Set order's expiration.
    pub fn until(mut self, gtof: impl Into<OrderGoodUntil>) -> Self {
        self.until = Some(gtof.into());
        self
    }

    /// Time execution pattern.
    ///
    /// See also [`OrderBuilder::time_in_force`].
    pub fn execution(mut self, execution: impl Into<OrderExecution>) -> Self {
        self.execution = Some(execution.into());
        self
    }

    /// Allowed slippage (%) for long term and conditional Market orders.
    ///
    /// Allowed price slippage is calculated based on the provided PerpetualMarket oracle price,
    /// or, a user-provided `price()` taking precedence.
    ///
    /// See also [What is Slippage in Crypto?](https://dydx.exchange/crypto-learning/what-is-slippage-in-crypto).
    pub fn allowed_slippage(mut self, slippage_percent: impl Into<BigDecimal>) -> Self {
        self.slippage = slippage_percent.into() / 100.0;
        self
    }

    /// Update the generator's market.
    ///
    /// Note that at the moment dYdX [doesn't support](https://dydx.exchange/faq) spot trading.
    pub fn update_market(&mut self, market_for: impl Into<OrderMarketParams>) {
        self.market_params = market_for.into();
    }

    /// Update the generator's market oracle price.
    pub fn update_market_price(&mut self, price: impl Into<Price>) {
        self.market_params.oracle_price = Some(price.into());
    }

    /* Builder */
    /// Build an [`Order`] and a corresponding [`OrderId`].
    ///
    /// `client_id` [impacts](https://docs.dydx.exchange/api_integration-clients/validator_client#replacing-an-order) an order id.
    /// So it is important to provide its uniqueness as otherwise some orders may overwrite others.
    pub fn build(self, client_id: impl Into<ClientId>) -> Result<(OrderId, Order), Error> {
        let side = self
            .side
            .ok_or_else(|| err!("Missing Order side (Buy/Sell)"))?;
        let size = self
            .size
            .as_ref()
            .ok_or_else(|| err!("Missing Order size"))?;
        let ty = self.ty.as_ref().ok_or_else(|| err!("Missing Order type"))?;
        let post_only = self.post_only.as_ref().unwrap_or(&false);
        let execution = self.execution.as_ref().unwrap_or(&OrderExecution::Default);
        let time_in_force = ty.time_in_force(
            &self.time_in_force.unwrap_or(OrderTimeInForce::Unspecified),
            *post_only,
            execution,
        )?;
        let reduce_only = *self.reduce_only.as_ref().unwrap_or(&false);
        let until = self
            .until
            .as_ref()
            .ok_or_else(|| err!("Missing Order until (good-til-oneof)"))?;
        let quantums = self
            .market_params
            .quantize_quantity(size.clone())
            .to_u64()
            .ok_or_else(|| err!("Failed converting BigDecimal size into u64"))?;
        let conditional_order_trigger_subticks = match ty {
            OrderType::StopLimit
            | OrderType::StopMarket
            | OrderType::TakeProfit
            | OrderType::TakeProfitMarket => self
                .market_params
                .quantize_price(
                    self.trigger_price
                        .clone()
                        .ok_or_else(|| err!("Missing Order trigger price"))?,
                )
                .to_u64()
                .ok_or_else(|| err!("Failed converting BigDecimal trigger-price into u64"))?,
            _ => 0,
        };

        let clob_pair_id = self.market_params.clob_pair_id().0;

        let order_id = OrderId {
            subaccount_id: Some(self.subaccount_id.clone()),
            client_id: client_id.into().0,
            order_flags: self.flags.clone() as u32,
            clob_pair_id,
        };

        let order = Order {
            order_id: Some(order_id.clone()),
            side: side.into(),
            quantums,
            subticks: self.calculate_subticks()?,
            time_in_force: time_in_force.into(),
            reduce_only,
            client_metadata: DEFAULT_RUST_CLIENT_METADATA,
            condition_type: ty.condition_type()?.into(),
            conditional_order_trigger_subticks,
            good_til_oneof: Some(until.clone().try_into()?),
        };

        Ok((order_id, order))
    }

    /* Helpers */
    fn calculate_subticks(&self) -> Result<u64, Error> {
        let ty = self.ty.as_ref().ok_or_else(|| err!("Missing Order type"))?;
        let price = match ty {
            OrderType::Market | OrderType::StopMarket | OrderType::TakeProfitMarket => {
                // Use user-provided slippage price
                if let Some(price) = self.price.clone() {
                    price
                // Calculate slippage price based on oracle price
                } else if let Some(oracle_price) = self.market_params.oracle_price.clone() {
                    let side = self
                        .side
                        .as_ref()
                        .ok_or_else(|| err!("Missing Order side"))?;
                    let one = <BigDecimal as One>::one();
                    match side {
                        OrderSide::Buy => oracle_price * (one + &self.slippage),
                        OrderSide::Sell => oracle_price * (one - &self.slippage),
                        _ => return Err(err!("Order side {side:?} not supported")),
                    }
                } else {
                    return Err(err!("Failed to calculate Market order slippage price"));
                }
            }
            _ => self
                .price
                .clone()
                .ok_or_else(|| err!("Missing Order price"))?,
        };

        self.market_params
            .quantize_price(price)
            .to_u64()
            .ok_or_else(|| err!("Failed converting BigDecimal price into u64"))
    }
}

impl OrderType {
    /// Validate time execution options.
    ///
    /// See also [`OrderBuilder::time_in_force`].
    pub fn time_in_force(
        &self,
        time_in_force: &OrderTimeInForce,
        post_only: bool,
        execution: &OrderExecution,
    ) -> Result<OrderTimeInForce, Error> {
        match self {
            OrderType::Market => Ok(OrderTimeInForce::Ioc),
            OrderType::Limit => {
                if post_only {
                    Ok(OrderTimeInForce::PostOnly)
                } else {
                    Ok(*time_in_force)
                }
            }
            OrderType::StopLimit | OrderType::TakeProfit => match execution {
                OrderExecution::Default => Ok(OrderTimeInForce::Unspecified),
                OrderExecution::PostOnly => Ok(OrderTimeInForce::PostOnly),
                OrderExecution::Fok => Ok(OrderTimeInForce::FillOrKill),
                OrderExecution::Ioc => Ok(OrderTimeInForce::Ioc),
            },
            OrderType::StopMarket | OrderType::TakeProfitMarket => match execution {
                OrderExecution::Default | OrderExecution::PostOnly => Err(err!(
                    "Execution value {execution:?} not supported for order type {self:?}"
                )),
                OrderExecution::Fok => Ok(OrderTimeInForce::FillOrKill),
                OrderExecution::Ioc => Ok(OrderTimeInForce::Ioc),
            },
            _ => Err(err!(
                "Invalid combination of order type, time in force, and execution"
            )),
        }
    }

    /// Get [the condition type](https://docs.dydx.exchange/api_integration-trading/order_types#condition-types) for the order.
    pub fn condition_type(&self) -> Result<ConditionType, Error> {
        match self {
            OrderType::Limit | OrderType::Market => Ok(ConditionType::Unspecified),
            OrderType::StopLimit | OrderType::StopMarket => Ok(ConditionType::StopLoss),
            OrderType::TakeProfit | OrderType::TakeProfitMarket => Ok(ConditionType::TakeProfit),
            _ => Err(err!("Order type unsupported for condition type")),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::indexer::{ClobPairId, PerpetualMarketStatus, PerpetualMarketType, Ticker};
    use std::str::FromStr;

    fn sample_market_params() -> OrderMarketParams {
        PerpetualMarket {
            ticker: Ticker::from("BTC-USD"),

            atomic_resolution: -10,
            clob_pair_id: ClobPairId(0),
            market_type: PerpetualMarketType::Cross,
            quantum_conversion_exponent: -9,
            step_base_quantums: 1_000_000,
            subticks_per_tick: 100_000,

            base_open_interest: Default::default(),
            initial_margin_fraction: Default::default(),
            maintenance_margin_fraction: Default::default(),
            next_funding_rate: Default::default(),
            open_interest: Default::default(),
            open_interest_lower_cap: None,
            open_interest_upper_cap: None,
            oracle_price: Default::default(),
            price_change_24h: Default::default(),
            status: PerpetualMarketStatus::Active,
            step_size: Default::default(),
            tick_size: Default::default(),
            trades_24h: 0,
            volume_24h: Quantity(0.into()),
        }
        .into()
    }

    fn bigdecimal(val: &str) -> BigDecimal {
        BigDecimal::from_str(val).expect("Failed converting str into BigDecimal")
    }

    #[test]
    fn market_size_to_quantums() {
        let market = sample_market_params();
        let size = bigdecimal("0.01");
        let quantums = market.quantize_quantity(size);
        let expected = bigdecimal("100_000_000");
        assert_eq!(quantums, expected);
    }

    #[test]
    fn market_price_to_subticks() {
        let market = sample_market_params();
        let price = bigdecimal("50_000");
        let subticks = market.quantize_price(price);
        let expected = bigdecimal("5_000_000_000");
        assert_eq!(subticks, expected);
    }

    #[test]
    fn market_quantums_to_size() {
        let market = sample_market_params();
        let quantums = bigdecimal("100_000_000");
        let size = market.dequantize_quantums(quantums);
        let expected = bigdecimal("0.01");
        assert_eq!(size, expected);
    }

    #[test]
    fn market_subticks_to_price() {
        let market = sample_market_params();
        let subticks = bigdecimal("5_000_000_000");
        let price = market.dequantize_subticks(subticks);
        let expected = bigdecimal("50_000");
        assert_eq!(price, expected);
    }
}
