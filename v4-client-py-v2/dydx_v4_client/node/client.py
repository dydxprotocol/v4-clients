import asyncio
import base64
import json
from dataclasses import dataclass
from decimal import Decimal
from typing import Union, Dict, Any

import grpc
from google._upb._message import Message
from google.protobuf.json_format import MessageToDict
from typing_extensions import List, Optional, Self

from dydx_v4_client import OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.node.market import Market
from dydx_v4_client.node_helper_type import ExtendedSubaccount

from dydx_v4_client.utility import convert_quantum_bytes_to_value_with_order_side
from dydx_v4_client import OrderFlags
from dydx_v4_client.indexer.rest.constants import OrderType
from dydx_v4_client.node.market import Market
from dydx_v4_client.node_helper_type import ExtendedSubaccount
from dydx_v4_client.utility import convert_quantum_bytes_to_value_with_order_side
from v4_proto.cosmos.auth.v1beta1 import query_pb2_grpc as auth
from v4_proto.cosmos.auth.v1beta1.auth_pb2 import BaseAccount
from v4_proto.cosmos.auth.v1beta1.query_pb2 import QueryAccountRequest
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.bank.v1beta1 import query_pb2_grpc as bank_query_grpc
from v4_proto.cosmos.base.tendermint.v1beta1 import query_pb2 as tendermint_query
from v4_proto.cosmos.base.tendermint.v1beta1 import (
    query_pb2_grpc as tendermint_query_grpc,
)
from v4_proto.cosmos.base.query.v1beta1 import pagination_pb2 as pagination_query
from v4_proto.cosmos.staking.v1beta1 import query_pb2 as staking_query
from v4_proto.cosmos.staking.v1beta1 import query_pb2_grpc as staking_query_grpc
from v4_proto.cosmos.distribution.v1beta1 import query_pb2 as distribution_query
from v4_proto.cosmos.distribution.v1beta1 import (
    query_pb2_grpc as distribution_query_grpc,
    tx_pb2,
)
from v4_proto.cosmos.tx.v1beta1 import service_pb2_grpc
from v4_proto.cosmos.tx.v1beta1.service_pb2 import (
    BroadcastMode,
    BroadcastTxRequest,
    SimulateRequest,
    GetTxRequest,
)
from v4_proto.cosmos.gov.v1 import query_pb2 as gov_query
from v4_proto.cosmos.gov.v1 import query_pb2_grpc as gov_query_grpc
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import Tx
from v4_proto.dydxprotocol.accountplus import query_pb2 as accountplus_query
from v4_proto.dydxprotocol.accountplus import query_pb2_grpc as accountplus_query_grpc
from v4_proto.dydxprotocol.bridge import query_pb2 as bridge_query
from v4_proto.dydxprotocol.bridge import query_pb2_grpc as bridge_query_grpc
from v4_proto.dydxprotocol.clob import clob_pair_pb2 as clob_pair_type
from v4_proto.dydxprotocol.clob import (
    equity_tier_limit_config_pb2 as equity_tier_limit_config_type,
)
from v4_proto.dydxprotocol.clob import query_pb2 as clob_query
from v4_proto.dydxprotocol.clob import query_pb2_grpc as clob_query_grpc
from v4_proto.dydxprotocol.clob.order_pb2 import Order, OrderId
from v4_proto.dydxprotocol.clob.query_pb2 import (
    QueryAllClobPairRequest,
    QueryClobPairAllResponse,
)
from v4_proto.dydxprotocol.feetiers import query_pb2 as fee_tier_query
from v4_proto.dydxprotocol.feetiers import query_pb2_grpc as fee_tier_query_grpc
from v4_proto.dydxprotocol.perpetuals import query_pb2_grpc as perpetuals_query_grpc
from v4_proto.dydxprotocol.perpetuals.query_pb2 import (
    QueryAllPerpetualsRequest,
    QueryAllPerpetualsResponse,
    QueryPerpetualRequest,
    QueryPerpetualResponse,
)
from v4_proto.dydxprotocol.prices import market_price_pb2 as market_price_type
from v4_proto.dydxprotocol.prices import query_pb2_grpc as prices_query_grpc
from v4_proto.dydxprotocol.prices.query_pb2 import (
    QueryAllMarketPricesRequest,
    QueryAllMarketPricesResponse,
    QueryMarketPriceRequest,
)
from v4_proto.dydxprotocol.revshare.revshare_pb2 import OrderRouterRevShare
from v4_proto.dydxprotocol.rewards import query_pb2 as rewards_query
from v4_proto.dydxprotocol.rewards import query_pb2_grpc as rewards_query_grpc
from v4_proto.dydxprotocol.stats import query_pb2 as stats_query
from v4_proto.dydxprotocol.stats import query_pb2_grpc as stats_query_grpc
from v4_proto.dydxprotocol.subaccounts import query_pb2 as subaccount_query
from v4_proto.dydxprotocol.subaccounts import query_pb2_grpc as subaccounts_query_grpc
from v4_proto.dydxprotocol.subaccounts import subaccount_pb2 as subaccount_type
from v4_proto.dydxprotocol.subaccounts.query_pb2 import (
    QueryAllSubaccountRequest,
    QueryGetSubaccountRequest,
    QuerySubaccountAllResponse,
)
from v4_proto.dydxprotocol.subaccounts.subaccount_pb2 import SubaccountId
from v4_proto.dydxprotocol.clob.tx_pb2 import OrderBatch
from v4_proto.dydxprotocol.ratelimit import query_pb2 as rate_query
from v4_proto.dydxprotocol.ratelimit import query_pb2_grpc as rate_query_grpc
from v4_proto.dydxprotocol.affiliates import query_pb2 as affiliate_query
from v4_proto.dydxprotocol.affiliates import query_pb2_grpc as affiliate_query_grpc
from v4_proto.dydxprotocol.revshare import query_pb2_grpc as revshare_query_grpc
from v4_proto.dydxprotocol.revshare import query_pb2 as revshare_query
from v4_proto.dydxprotocol.revshare import tx_pb2_grpc as revshare_tx_grpc
from v4_proto.dydxprotocol.revshare import tx_pb2 as revshare_tx_query
from v4_proto.dydxprotocol.revshare import params_pb2 as revshare_param
from v4_proto.dydxprotocol.revshare import revshare_pb2

from dydx_v4_client.network import NodeConfig
from dydx_v4_client.node.authenticators import Authenticator, validate_authenticator
from dydx_v4_client.node.builder import Builder
from dydx_v4_client.node.fee import Coin, Fee, calculate_fee, Denom
from dydx_v4_client.node.subaccount import SubaccountInfo
from dydx_v4_client.node.message import (
    cancel_order,
    deposit,
    place_order,
    send_token,
    transfer,
    withdraw,
    batch_cancel,
    add_authenticator,
    remove_authenticator,
    create_market_permissionless,
    register_affiliate,
    withdraw_delegator_reward,
    undelegate,
    delegate,
)
from dydx_v4_client.wallet import Wallet

DEFAULT_QUERY_TIMEOUT_SECS = 15
DEFAULT_QUERY_INTERVAL_SECS = 2
GOOD_TIL_BLOCK_OFFSET = 20


class CustomJSONDecoder:
    def __init__(self):
        self.decoder = json.JSONDecoder(object_hook=self.decode_dict)

    def decode(self, json_string):
        return self.decoder.decode(json_string)

    @staticmethod
    def decode_base64(value):
        if isinstance(value, str):
            try:
                return list(base64.b64decode(value))
            except (base64.binascii.Error, ValueError):
                return value
        return value

    def decode_dict(self, data):
        if isinstance(data, dict):
            return {k: self.decode_base64(v) for k, v in data.items()}
        return data


@dataclass
class QueryNodeClient:
    channel: grpc.Channel

    @staticmethod
    def transcode_response(response: Message) -> Union[Dict[str, Any], List[Any]]:
        """
        Encodes the response using the custom JSON encoder.

        Args:
            response (Message): The response message to encode.

        Returns:
            Union[Dict[str, Any], List[Any]]: The encoded response.
        """
        response_dict = MessageToDict(response)
        json_string = json.dumps(response_dict)
        return CustomJSONDecoder().decode(json_string)

    async def get_account_balances(
        self, address: str
    ) -> bank_query.QueryAllBalancesResponse:
        """
        Retrieves all account balances for a given address.

        Args:
            address (str): The account address.

        Returns:
            bank_query.QueryAllBalancesResponse: The response containing all account balances.
        """
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.AllBalances(bank_query.QueryAllBalancesRequest(address=address))

    async def get_account_balance(
        self, address: str, denom: str
    ) -> bank_query.QueryBalanceResponse:
        """
        Retrieves the account balance for a specific denomination.

        Args:
            address (str): The account address.
            denom (str): The denomination of the balance.

        Returns:
            bank_query.QueryBalanceResponse: The response containing the account balance.
        """
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.Balance(
            bank_query.QueryBalanceRequest(address=address, denom=denom)
        )

    async def get_account(self, address: str) -> BaseAccount:
        """
        Retrieves the account information for a given address.

        Args:
            address (str): The account address.

        Returns:
            BaseAccount: The base account information.
        """
        account = BaseAccount()
        response = auth.QueryStub(self.channel).Account(
            QueryAccountRequest(address=address)
        )
        if not response.account.Unpack(account):
            raise Exception("Failed to unpack account")
        return account

    async def latest_block(self) -> tendermint_query.GetLatestBlockResponse:
        """
        Retrieves the latest block information.

        Returns:
            tendermint_query.GetLatestBlockResponse: The response containing the latest block information.
        """
        return tendermint_query_grpc.ServiceStub(self.channel).GetLatestBlock(
            tendermint_query.GetLatestBlockRequest()
        )

    async def latest_block_height(self) -> int:
        """
        Retrieves the height of the latest block.

        Returns:
            int: The height of the latest block.
        """
        block = await self.latest_block()
        return block.block.header.height

    async def get_user_stats(self, address: str) -> stats_query.QueryUserStatsResponse:
        """
        Retrieves the user stats for a given address.

        Args:
            address (str): The user address.

        Returns:
            stats_query.QueryUserStatsResponse: The response containing the user stats.
        """
        stub = stats_query_grpc.QueryStub(self.channel)
        return stub.UserStats(stats_query.QueryUserStatsRequest(user=address))

    async def get_all_validators(
        self, status: str = ""
    ) -> staking_query.QueryValidatorsResponse:
        """
        Retrieves all validators with an optional status filter.

        Args:
            status (str, optional): The validator status filter. Defaults to an empty string.

        Returns:
            staking_query.QueryValidatorsResponse: The response containing all validators.
        """
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.Validators(staking_query.QueryValidatorsRequest(status=status))

    async def get_subaccount(
        self, address: str, account_number: int
    ) -> ExtendedSubaccount:
        """
        Retrieves a subaccount for a given address and account number.

        Args:
            address (str): The owner address.
            account_number (int): The subaccount number.

        Returns:
            Optional[subaccount_type.Subaccount]: The subaccount, if found.
        """
        stub = subaccounts_query_grpc.QueryStub(self.channel)
        response = stub.Subaccount(
            QueryGetSubaccountRequest(owner=address, number=account_number)
        )
        return ExtendedSubaccount(response.subaccount)

    async def get_subaccounts(self) -> QuerySubaccountAllResponse:
        """
        Retrieves all subaccounts.

        Returns:
            QuerySubaccountAllResponse: The response containing all subaccounts.
        """
        stub = subaccounts_query_grpc.QueryStub(self.channel)
        return stub.SubaccountAll(QueryAllSubaccountRequest())

    async def get_clob_pair(self, pair_id: int) -> clob_pair_type.ClobPair:
        """
        Retrieves a CLOB pair by its ID.

        Args:
            pair_id (int): The CLOB pair ID.

        Returns:
            clob_pair_type.ClobPair: The CLOB pair.
        """
        stub = clob_query_grpc.QueryStub(self.channel)
        response = stub.ClobPair(clob_query.QueryGetClobPairRequest(id=pair_id))
        return response.clob_pair

    async def get_clob_pairs(self) -> QueryClobPairAllResponse:
        """
        Retrieves all CLOB pairs.

        Returns:
            QueryClobPairAllResponse: The response containing all CLOB pairs.
        """
        stub = clob_query_grpc.QueryStub(self.channel)
        return stub.ClobPairAll(QueryAllClobPairRequest())

    async def get_price(self, market_id: int) -> market_price_type.MarketPrice:
        """
        Retrieves the market price for a given market ID.

        Args:
            market_id (int): The market ID.

        Returns:
            market_price_type.MarketPrice: The market price.
        """
        stub = prices_query_grpc.QueryStub(self.channel)
        response = stub.MarketPrice(QueryMarketPriceRequest(id=market_id))
        return response.market_price

    async def get_prices(self) -> QueryAllMarketPricesResponse:
        """
        Retrieves all market prices.

        Returns:
            QueryAllMarketPricesResponse: The response containing all market prices.
        """
        stub = prices_query_grpc.QueryStub(self.channel)
        return stub.AllMarketPrices(QueryAllMarketPricesRequest())

    async def get_perpetual(self, perpetual_id: int) -> QueryPerpetualResponse:
        """
        Retrieves a perpetual by its ID.

        Args:
            perpetual_id (int): The perpetual ID.

        Returns:
            QueryPerpetualResponse: The response containing the perpetual.
        """
        stub = perpetuals_query_grpc.QueryStub(self.channel)
        return stub.Perpetual(QueryPerpetualRequest(id=perpetual_id))

    async def get_perpetuals(self) -> QueryAllPerpetualsResponse:
        """
        Retrieves all perpetuals.

        Returns:
            QueryAllPerpetualsResponse: The response containing all perpetuals.
        """
        stub = perpetuals_query_grpc.QueryStub(self.channel)
        return stub.AllPerpetuals(QueryAllPerpetualsRequest())

    async def get_equity_tier_limit_config(
        self,
    ) -> equity_tier_limit_config_type.EquityTierLimitConfiguration:
        """
        Retrieves the equity tier limit configuration.

        Returns:
            equity_tier_limit_config_type.EquityTierLimitConfiguration: The equity tier limit configuration.
        """
        stub = clob_query_grpc.QueryStub(self.channel)
        response = stub.EquityTierLimitConfiguration(
            clob_query.QueryEquityTierLimitConfigurationRequest()
        )
        return response.equity_tier_limit_config

    async def get_delegator_delegations(
        self, delegator_addr: str
    ) -> staking_query.QueryDelegatorDelegationsResponse:
        """
        Retrieves the delegations for a given delegator address.

        Args:
            delegator_addr (str): The delegator address.

        Returns:
            staking_query.QueryDelegatorDelegationsResponse: The response containing the delegator delegations.
        """
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.DelegatorDelegations(
            staking_query.QueryDelegatorDelegationsRequest(
                delegator_addr=delegator_addr
            )
        )

    async def get_delegator_unbonding_delegations(
        self, delegator_addr: str
    ) -> staking_query.QueryDelegatorUnbondingDelegationsResponse:
        """
        Retrieves the unbonding delegations for a given delegator address.

        Args:
            delegator_addr (str): The delegator address.

        Returns:
            staking_query.QueryDelegatorUnbondingDelegationsResponse: The response containing the delegator unbonding delegations.
        """
        stub = staking_query_grpc.QueryStub(self.channel)
        return stub.DelegatorUnbondingDelegations(
            staking_query.QueryDelegatorUnbondingDelegationsRequest(
                delegator_addr=delegator_addr
            )
        )

    async def get_delayed_complete_bridge_messages(
        self, address: str = ""
    ) -> bridge_query.QueryDelayedCompleteBridgeMessagesResponse:
        """
        Retrieves the delayed complete bridge messages for a given address.

        Args:
            address (str, optional): The address. Defaults to an empty string.

        Returns:
            bridge_query.QueryDelayedCompleteBridgeMessagesResponse: The response containing the delayed complete bridge messages.
        """
        stub = bridge_query_grpc.QueryStub(self.channel)
        return stub.DelayedCompleteBridgeMessages(
            bridge_query.QueryDelayedCompleteBridgeMessagesRequest(address=address)
        )

    async def get_fee_tiers(self) -> fee_tier_query.QueryPerpetualFeeParamsResponse:
        """
        Retrieves the perpetual fee parameters.

        Returns:
            fee_tier_query.QueryPerpetualFeeParamsResponse: The response containing the perpetual fee parameters.
        """
        stub = fee_tier_query_grpc.QueryStub(self.channel)
        return stub.PerpetualFeeParams(fee_tier_query.QueryPerpetualFeeParamsRequest())

    async def get_user_fee_tier(
        self, address: str
    ) -> fee_tier_query.QueryUserFeeTierResponse:
        """
        Retrieves the user fee tier for a given address.

        Args:
            address (str): The user address.

        Returns:
            fee_tier_query.QueryUserFeeTierResponse: The response containing the user fee tier.
        """
        stub = fee_tier_query_grpc.QueryStub(self.channel)
        return stub.UserFeeTier(fee_tier_query.QueryUserFeeTierRequest(user=address))

    async def get_rewards_params(self) -> rewards_query.QueryParamsResponse:
        """
        Retrieves the rewards parameters.

        Returns:
            rewards_query.QueryParamsResponse: The response containing the rewards parameters.
        """
        stub = rewards_query_grpc.QueryStub(self.channel)
        return stub.Params(rewards_query.QueryParamsRequest())

    async def get_authenticators(
        self, address: str
    ) -> accountplus_query.GetAuthenticatorsResponse:
        stub = accountplus_query_grpc.QueryStub(self.channel)
        return stub.GetAuthenticators(
            accountplus_query.GetAuthenticatorsRequest(account=address)
        )

    async def get_node_info(self) -> tendermint_query.GetNodeInfoResponse:
        """
        Query for node info.

        Returns:
            tendermint_query.GetNodeInfoResponse: The response containing the node information.
        """
        return tendermint_query_grpc.ServiceStub(self.channel).GetNodeInfo(
            tendermint_query.GetNodeInfoRequest()
        )

    async def get_delegation_total_rewards(
        self, address: str
    ) -> distribution_query.QueryDelegationTotalRewardsResponse:
        """
        Get all unbonding delegations from a delegator.

        Args:
            address (str): The delegator address

        Returns:
            distribution_query.QueryDelegationTotalRewardsResponse: All unbonding delegations from a delegator.
        """
        return distribution_query_grpc.QueryStub(self.channel).DelegationTotalRewards(
            distribution_query.QueryDelegationTotalRewardsRequest(
                delegator_address=address
            )
        )

    async def get_all_gov_proposals(
        self,
        proposal_status: Optional[str] = None,
        voter: Optional[str] = None,
        depositor: Optional[str] = None,
        key: Optional[bytes] = None,
        offset: Optional[int] = None,
        limit: Optional[int] = None,
        count_total: Optional[bool] = False,
        reverse: Optional[bool] = False,
    ) -> gov_query.QueryProposalsResponse:
        """
        Query all gov proposals

        Args:
            proposal_status (Optional[ProposalStatus]): Status of the proposal to filter by.
            voter (Optional[str]): Voter to filter by.
            depositor (Optional[str]): Depositor to filter by.
            key (Optional[byte]): Key to filter by.
            offset (Optional[int]): Offset number.
            limit (Optional[int]): Number of items to retrieve.
            count_total (Optional[bool]): Filter to return total count or not
            reverse (Optional[bool]): Direction of the list
        """
        return gov_query_grpc.QueryStub(self.channel).Proposals(
            gov_query.QueryProposalsRequest(
                proposal_status=proposal_status,
                voter=voter,
                depositor=depositor,
                pagination=pagination_query.PageRequest(
                    key=key,
                    offset=offset,
                    limit=limit,
                    count_total=count_total,
                    reverse=reverse,
                ),
            )
        )

    async def get_withdrawal_and_transfer_gating_status(
        self, perpetual_id: int
    ) -> subaccount_query.QueryGetWithdrawalAndTransfersBlockedInfoResponse:
        """
        Query the status of the withdrawal and transfer gating

        Args:
            perpetual_id (int): The perpetual ID.

        Returns:
            subaccount_query.QueryGetWithdrawalAndTransfersBlockedInfoResponse: Withdrawal and transfer gating status of the perpetual id
        """
        return subaccounts_query_grpc.QueryStub(
            self.channel
        ).GetWithdrawalAndTransfersBlockedInfo(
            subaccount_query.QueryGetWithdrawalAndTransfersBlockedInfoRequest(
                perpetual_id=perpetual_id
            )
        )

    async def get_withdrawal_capacity_by_denom(
        self, denom: str
    ) -> rate_query.QueryCapacityByDenomResponse:
        """
        Query withdrawal capacity by denomination value

        Args:
            denom (str): Denomination identifier

        Returns:
            rate_query.QueryCapacityByDenomResponse: Return withdraw capacity
        """
        return rate_query_grpc.QueryStub(self.channel).CapacityByDenom(
            rate_query.QueryCapacityByDenomRequest(denom=denom)
        )

    async def get_affiliate_info(
        self, address: str
    ) -> affiliate_query.AffiliateInfoResponse:
        """
        Query affiliate information of an address

        Args:
            address (str): Address to get affiliate information of

        Returns:
            affiliate_query.AffiliateInfoResponse: Affiliate information of the address
        """
        return affiliate_query_grpc.QueryStub(self.channel).AffiliateInfo(
            affiliate_query.AffiliateInfoRequest(address=address)
        )

    async def get_referred_by(self, address: str) -> affiliate_query.ReferredByResponse:
        """
        Query to reference information by address

        Args:
            address (str): Address to get referred by information

        Returns:
            affiliate_query.ReferredByResponse: Referred by information
        """
        return affiliate_query_grpc.QueryStub(self.channel).ReferredBy(
            affiliate_query.ReferredByRequest(address=address)
        )

    async def get_all_affiliate_tiers(
        self,
    ) -> affiliate_query.AllAffiliateTiersResponse:
        """
        Query all affiliate tiers

        Returns:
            affiliate_query.AllAffiliateTiersResponse: All affiliate tiers
        """
        return affiliate_query_grpc.QueryStub(self.channel).AllAffiliateTiers(
            affiliate_query.AllAffiliateTiersRequest()
        )

    async def get_affiliate_whitelist(
        self,
    ) -> affiliate_query.AffiliateWhitelistResponse:
        """
        Query whitelisted affiliate information

        Returns:
            affiliate_query.AffiliateWhitelistResponse: List of whitelisted affiliate
        """
        return affiliate_query_grpc.QueryStub(self.channel).AffiliateWhitelist(
            affiliate_query.AffiliateWhitelistRequest()
        )

    async def get_market_mapper_revenue_share_param(
        self,
    ) -> revshare_query.QueryMarketMapperRevenueShareParamsResponse:
        """
        Query revenue share params

        Returns:
            revshare_query.QueryMarketMapperRevenueShareParamsResponse: Market mapper revenue share parameters
        """
        return revshare_query_grpc.QueryStub(
            self.channel
        ).MarketMapperRevenueShareParams(
            revshare_query.QueryMarketMapperRevenueShareParams()
        )

    async def get_market_mapper_revenue_share_details(
        self, market_id: int
    ) -> revshare_query.QueryMarketMapperRevShareDetailsResponse:
        """
        Query revenue share details by market id

        Args:
            market_id(int): Market id to query

        Returns:
            revshare_query.QueryMarketMapperRevShareDetailsResponse: Details of market mapper revenue share
        """
        return revshare_query_grpc.QueryStub(self.channel).MarketMapperRevShareDetails(
            revshare_query.QueryMarketMapperRevShareDetails(market_id=market_id)
        )

    async def get_unconditional_revenue_sharing_config(
        self,
    ) -> revshare_query.QueryUnconditionalRevShareConfigResponse:
        """
        Query configuration of unconditional revenue sharing

        Returns:
            revshare_query.QueryUnconditionalRevShareConfigResponse: The configuration of unconditional revenue sharing
        """
        return revshare_query_grpc.QueryStub(self.channel).UnconditionalRevShareConfig(
            revshare_query.QueryUnconditionalRevShareConfig()
        )

    async def get_order_router_revenue_share(
        self, address: str
    ) -> revshare_query.QueryOrderRouterRevShareResponse:
        """
        Query order router revenue share of certain address

        Args:
            address(str): Address to fetch order router revenue share of

        Returns:
            revshare_query.QueryOrderRouterRevShareResponse: Order router revenue share response
        """
        return revshare_query_grpc.QueryStub(self.channel).OrderRouterRevShare(
            revshare_query.QueryOrderRouterRevShare(address=address)
        )


class SequenceManager:
    def __init__(self, query_node_client: QueryNodeClient):
        self.query_node_client = query_node_client

    async def before_send(self, subaccount: SubaccountInfo):
        """
        Update sequence number before sending transaction.
        For permissioned wallets, fetch account info using subaccount.address.
        """
        if self.query_node_client:
            # For permissioned wallets, use the account address, not signing wallet address
            account = await self.query_node_client.get_account(subaccount.address)
            subaccount.signing_wallet.sequence = account.sequence

    async def after_send(self, subaccount: SubaccountInfo):
        """
        Update sequence number after sending transaction.
        Only increment if not using query_node_client (local sequence management).
        """
        if not self.query_node_client:
            subaccount.signing_wallet.sequence += 1


@dataclass
class MutatingNodeClient(QueryNodeClient):
    builder: Builder
    sequence_manager: SequenceManager = None

    async def broadcast(self, transaction: Tx, mode=BroadcastMode.BROADCAST_MODE_SYNC):
        """
        Broadcasts a transaction.

        Args:
            transaction (Tx): The transaction to broadcast.
            mode (BroadcastMode, optional): The broadcast mode. Defaults to BroadcastMode.BROADCAST_MODE_SYNC.

        Returns:
            The response from the broadcast.
        """
        request = BroadcastTxRequest(
            tx_bytes=transaction.SerializeToString(), mode=mode
        )

        return service_pb2_grpc.ServiceStub(self.channel).BroadcastTx(request)

    async def simulate(self, transaction: Tx):
        """
        Simulates a transaction.

        Args:
            transaction (Tx): The transaction to simulate.

        Returns:
            The response from the simulation.
        """
        request = SimulateRequest(tx=transaction)

        return service_pb2_grpc.ServiceStub(self.channel).Simulate(request)

    async def send(
        self, subaccount: SubaccountInfo, transaction: Tx, mode=BroadcastMode.BROADCAST_MODE_SYNC
    ):
        """
        Sends a transaction.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            transaction (Tx): The transaction to send.
            mode (BroadcastMode, optional): The broadcast mode. Defaults to BroadcastMode.BROADCAST_MODE_SYNC.

        Returns:
            The response from the broadcast.
        """
        builder = self.builder
        simulated = await self.simulate(transaction)

        fee = self.builder.calculate_fee(simulated.gas_info.gas_used)

        transaction = builder.build_transaction(subaccount, transaction.body.messages, fee)

        return await self.broadcast(transaction, mode)

    async def send_message(
        self, subaccount: SubaccountInfo, message: Message, mode=BroadcastMode.BROADCAST_MODE_SYNC
    ):
        """
        Sends a message.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            message (Message): The message to send.
            mode (BroadcastMode, optional): The broadcast mode. Defaults to BroadcastMode.BROADCAST_MODE_SYNC.

        Returns:
            The response from the broadcast.
        """
        if self.sequence_manager:
            await self.sequence_manager.before_send(subaccount)

        response = await self.send(subaccount, self.builder.build(subaccount, message), mode)

        if self.sequence_manager:
            await self.sequence_manager.after_send(subaccount)

        return response

    async def broadcast_message(
        self,
        subaccount: SubaccountInfo,
        message: Message,
        mode=BroadcastMode.BROADCAST_MODE_SYNC,
    ):
        """
        Broadcasts a message.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            message (Message): The message to broadcast.
            mode (BroadcastMode, optional): The broadcast mode. Defaults to BroadcastMode.BROADCAST_MODE_SYNC.

        Returns:
            The response from the broadcast.
        """
        if self.sequence_manager:
            await self.sequence_manager.before_send(subaccount)

        response = await self.broadcast(
            self.builder.build(subaccount, message),
            mode,
        )

        if self.sequence_manager:
            await self.sequence_manager.after_send(subaccount)

        return response

    def build_transaction(self, subaccount: SubaccountInfo, messages: List[Message], fee: Fee):
        """
        Builds a transaction.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            messages (List[Message]): The list of messages to include in the transaction.
            fee (Fee): The fee to use for the transaction.

        Returns:
            The built transaction.
        """
        return self.builder.build_transaction(subaccount, messages, fee.as_proto())

    def build(self, subaccount: SubaccountInfo, message: Message, fee: Fee):
        """
        Builds a transaction with a single message.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            message (Message): The message to include in the transaction.
            fee (Fee): The fee to use for the transaction.

        Returns:
            The built transaction.
        """
        return self.builder.build(subaccount, message, fee.as_proto())

    def calculate_fee(self, gas_used) -> Fee:
        """
        Calculates the fee based on the gas used.

        Args:
            gas_used: The amount of gas used.

        Returns:
            Fee: The calculated fee.
        """
        gas_limit, amount = calculate_fee(gas_used, Denom(self.builder.denomination))
        return Fee(gas_limit, [Coin(amount, self.builder.denomination)])


@dataclass
class NodeClient(MutatingNodeClient):
    manage_sequence: bool = True

    @staticmethod
    async def connect(config: NodeConfig) -> Self:
        client = NodeClient(config.channel, Builder(config.chain_id, config.usdc_denom))
        if client.manage_sequence:
            client.sequence_manager = SequenceManager(QueryNodeClient(client.channel))
        return client

    async def deposit(
        self,
        subaccount: SubaccountInfo,
        sender: str,
        recipient_subaccount: SubaccountId,
        asset_id: int,
        quantums: int,
    ):
        """
        Deposits funds into a subaccount.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            sender (str): The sender address.
            recipient_subaccount (SubaccountId): The recipient subaccount ID.
            asset_id (int): The asset ID.
            quantums (int): The amount of quantums to deposit.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.send_message(
            subaccount, deposit(sender, recipient_subaccount, asset_id, quantums)
        )

    async def withdraw(
        self,
        subaccount: SubaccountInfo,
        sender_subaccount: SubaccountId,
        recipient: str,
        asset_id: int,
        quantums: int,
    ):
        """
        Withdraws funds from a subaccount.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            sender_subaccount (SubaccountId): The sender subaccount ID.
            recipient (str): The recipient address.
            asset_id (int): The asset ID.
            quantums (int): The amount of quantums to withdraw.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.send_message(
            subaccount, withdraw(sender_subaccount, recipient, asset_id, quantums)
        )

    async def send_token(
        self,
        subaccount: SubaccountInfo,
        sender: str,
        recipient: str,
        quantums: int,
        denomination: str,
    ):
        """
        Sends tokens from one address to another.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            sender (str): The sender address.
            recipient (str): The recipient address.
            quantums (int): The amount of quantums to send.
            denomination (str): The denomination of the token.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.send_message(
            subaccount, send_token(sender, recipient, quantums, denomination)
        )

    async def transfer(
        self,
        subaccount: SubaccountInfo,
        sender_subaccount: SubaccountId,
        recipient_subaccount: SubaccountId,
        asset_id: int,
        amount: int,
    ):
        """
        Transfers funds between subaccounts.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            sender_subaccount (SubaccountId): The sender subaccount ID.
            recipient_subaccount (SubaccountId): The recipient subaccount ID.
            asset_id (int): The asset ID.
            amount (int): The amount to transfer.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.send_message(
            subaccount,
            transfer(
                sender_subaccount,
                recipient_subaccount,
                asset_id,
                amount,
            ),
        )

    async def place_order(
        self,
        subaccount: SubaccountInfo,
        order: Order,
    ):
        """
        Places an order.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            order (Order): The order to place.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.broadcast_message(
            subaccount,
            place_order(order),
        )

    async def cancel_order(
        self,
        subaccount: SubaccountInfo,
        order_id: OrderId,
        good_til_block: int = None,
        good_til_block_time: int = None,
    ):
        """
        Cancels an order.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            order_id (OrderId): The ID of the order to cancel.
            good_til_block (int, optional): The block number until which the order is valid. Defaults to None.
            good_til_block_time (int, optional): The block time until which the order is valid. Defaults to None.

        Returns:
            The response from the transaction broadcast.
        """
        return await self.broadcast_message(
            subaccount,
            cancel_order(order_id, good_til_block, good_til_block_time),
        )

    async def batch_cancel_orders(
        self,
        subaccount: SubaccountInfo,
        subaccount_id: SubaccountId,
        short_term_cancels: List[OrderBatch],
        good_til_block: int,
    ):
        """
        Batch cancels orders for a subaccount.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            subaccount_id (SubaccountId): The subaccount ID for which to cancel orders.
            short_term_cancels (List[OrderBatch]): List of OrderBatch objects containing the orders to cancel.
            good_til_block (int): The last block the short term order cancellations can be executed at.

        Returns:
            The response from the transaction broadcast.
        """
        batch_cancel_msg = batch_cancel(
            subaccount_id=subaccount_id,
            short_term_cancels=short_term_cancels,
            good_til_block=good_til_block,
        )
        return await self.broadcast_message(
            subaccount,
            batch_cancel_msg,
        )

    async def add_authenticator(
        self,
        subaccount: SubaccountInfo,
        authenticator: Authenticator,
    ):
        """
        Adds authenticator to a subaccount.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            authenticator Authenticator: The authenticator to be added.

        Returns:
            The response from the transaction broadcast.
        """
        if not validate_authenticator(authenticator):
            raise ValueError(
                "Invalid authenticator, please ensure the authenticator permissions are correct."
            )

        add_authenticator_msg = add_authenticator(
            subaccount.address,
            authenticator.type,
            authenticator.config,
        )

        return await self.send_message(
            subaccount,
            add_authenticator_msg,
        )

    async def remove_authenticator(self, subaccount: SubaccountInfo, authenticator_id: int):
        """
        Removes authenticator from a subaccount.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            authenticator_id (int): The authenticator identifier.

        Returns:
            The response from the transaction broadcast.
        """

        remove_authenticator_msg = remove_authenticator(
            subaccount.address,
            authenticator_id,
        )

        return await self.send_message(
            subaccount,
            remove_authenticator_msg,
        )

    async def create_transaction(self, subaccount: SubaccountInfo, message: Message) -> Tx:
        """
        Create a transaction

        Args:
            subaccount: SubaccountInfo containing wallet and authenticators
            message: Transaction message

        Returns:
            Tx: Returns transaction information
        """
        if self.sequence_manager:
            await self.sequence_manager.before_send(subaccount)

        transaction = self.builder.build(subaccount, message)
        simulated_response = await self.simulate(transaction)

        response = self.builder.build_transaction(
            subaccount=subaccount,
            messages=transaction.body.messages,
            fee=self.builder.calculate_fee(simulated_response.gas_info.gas_used),
        )
        if self.sequence_manager:
            await self.sequence_manager.after_send(subaccount)
        return response

    async def query_transaction(self, tx_hash: str) -> Tx:
        """
        Query the network for a transaction

        Args:
             tx_hash (str): Transaction hash

        Returns:
              Any: Transaction information
        """
        attempts = DEFAULT_QUERY_TIMEOUT_SECS // DEFAULT_QUERY_INTERVAL_SECS
        for _ in range(attempts):
            try:
                response = service_pb2_grpc.ServiceStub(self.channel).GetTx(
                    GetTxRequest(hash=tx_hash)
                )

                if response is None or response.tx is None:
                    raise Exception("Tx not present in broadcast response")
                return response.tx
            except Exception as e:
                print(f"Error: {e}")
                await asyncio.sleep(DEFAULT_QUERY_INTERVAL_SECS)
        raise Exception(f"Error querying Tx: {tx_hash}")

    async def query_address(self, address: str) -> (int, int):
        """
        Fetch account's number and sequence number from the network.

        Args:
            address (str): Account address

        Returns:
            (int,int): Tuple of account number and sequence number
        """
        account = await self.get_account(address)
        if account is None:
            raise Exception(f"No account found with associated {address}")
        return (account.account_number, account.sequence)

    async def create_market_permissionless(
        self, subaccount: SubaccountInfo, ticker: str, address: str, subaccount_id: int
    ) -> Any:
        """
        Create a market permissionless

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            ticker (str): The market identifier
            address (str): Subaccount address
            subaccount_id (int): Subaccount number
        """
        msg = create_market_permissionless(
            ticker=ticker, address=address, subaccount_id=subaccount_id
        )
        return await self.send_message(subaccount=subaccount, message=msg)

    async def delegate(
        self,
        subaccount: SubaccountInfo,
        delegator: str,
        validator: str,
        quamtums: int,
        denomination: str,
    ) -> Any:
        """
        Delegate coins from a delegator to a validator.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            delegator (str): Delegator address
            validator (str): Validator address
            quantums (int): amount
            denomination (str): Denomination

        Returns:
            Any: Delegate response
        """
        msg = delegate(
            delegator=delegator,
            validator=validator,
            quantums=quamtums,
            denomination=denomination,
        )
        return await self.send_message(subaccount, msg)

    async def undelegate(
        self,
        subaccount: SubaccountInfo,
        delegator: str,
        validator: str,
        quamtums: int,
        denomination: str,
    ) -> Any:
        """
        Undelegate coins from a delegator to a validator.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            delegator (str): Delegator address
            validator (str): Validator address
            quantums (int): amount
            denomination (str): Denomination

        Returns:
            Any: Undelegate response
        """
        msg = undelegate(
            delegator=delegator,
            validator=validator,
            quantums=quamtums,
            denomination=denomination,
        )
        return await self.send_message(subaccount, msg)

    async def withdraw_delegate_reward(
        self, subaccount: SubaccountInfo, delegator: str, validator: str
    ) -> Any:
        """
        Delegation withdrawal to a delegator from a validator.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            delegator (str): The delegator address
            validator (str): The validator address

        Returns:
            Any: withdrawal delegate reward
        """
        msg = withdraw_delegator_reward(delegator=delegator, validator=validator)
        return await self.send_message(subaccount, msg)

    async def register_affiliate(
        self, subaccount: SubaccountInfo, referee: str, affiliate: str
    ) -> Any:
        """
        Register a referee-affiliate relationship.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            referee (str): Affiliate referee address
            affiliate (str): Affiliate address

        Returns:
            Any: Register affiliate
        """
        msg = register_affiliate(referee=referee, affiliate=affiliate)
        return await self.send_message(subaccount=subaccount, message=msg)

    async def close_position(
        self,
        subaccount: SubaccountInfo,
        market: Market,
        client_id: int,
        reduce_by: Optional[Decimal],
        slippage_pct: float = 10,
    ) -> Any:
        """
        Close position for a given market.

        Args:
            subaccount (SubaccountInfo): The subaccount info containing wallet and authenticators.
            market: Market params
            reduce_by (Optional[Decimal]): reduced amount of the position
            client_id (int): The client id
            slippage_pct(float): Percentage to reduce or increase during close position

        Returns:
            Any: The close position response
        """
        if slippage_pct < 0 or slippage_pct > 100:
            raise ValueError("slippage_pct should be within 0 and 100")

        subaccount_data = await self.get_subaccount(subaccount.address, subaccount.subaccount_number)
        quantum_value = None
        order_side = None
        price = None
        try:
            for pos in subaccount_data.perpetual_positions:
                if pos.perpetual_id == int(market.market["clobPairId"]):
                    quantum_value = int.from_bytes(
                        pos.quantums[1:], byteorder="big", signed=False
                    )
                    if int(pos.quantums[0]) == 2:
                        order_side = Order.Side.SIDE_SELL
                        price = float(market.market["oraclePrice"]) * (
                            (100 - slippage_pct) / 100.0
                        )

                    else:
                        order_side = Order.Side.SIDE_BUY
                        price = float(market.market["oraclePrice"]) * (
                            (100 + slippage_pct) / 100.0
                        )
        except Exception as e:
            raise RuntimeError(f"Failed to parse position data: {e}") from e

        if quantum_value is None:
            return

        order_size = quantum_value / 10 ** (-market.market["atomicResolution"])
        if reduce_by is not None:
            order_size = min(order_size, reduce_by)
        order_id = market.order_id(
            subaccount.address, subaccount.subaccount_number, client_id, OrderFlags.SHORT_TERM
        )
        current_height = await self.latest_block_height()
        new_order = market.order(
            order_id=order_id,
            order_type=OrderType.MARKET,
            time_in_force=None,
            side=order_side,
            size=order_size,
            price=price,
            reduce_only=True,
            good_til_block=current_height + GOOD_TIL_BLOCK_OFFSET,
        )
        return await self.place_order(subaccount, new_order)

    async def set_order_router_revenue_share(
        self, authority: str, address: str, share_ppm: int
    ) -> revshare_tx_query.MsgSetOrderRouterRevShareResponse:
        """
        Set order router revenue share

        Args:
            authority (str): Setter's authority
            address (str): Address to receive revenue share
            share_ppm (int): Parts per million of revenue share

        Returns:
            revshare_tx_query.MsgSetOrderRouterRevShareResponse: Set order router revenue share response
        """
        return revshare_tx_grpc.MsgStub(self.channel).SetOrderRouterRevShare(
            revshare_tx_query.MsgSetOrderRouterRevShare(
                authority=authority,
                order_router_rev_share=OrderRouterRevShare(
                    address=address, share_ppm=share_ppm
                ),
            )
        )

    async def set_market_mapper_revenue_share(
        self, authority: str, address: str, revenue_share_ppm: int, valid_days: int
    ) -> revshare_tx_query.MsgSetMarketMapperRevenueShareResponse:
        """
        Set market mapper revenue share

        Args:
            authority (str): Setter's authority
            address (str): Address to receive revenue share
            revenue_share_ppm (int): Parts per million of revenue share
            valid_days (int): Validity in days

        Returns:
            revshare_tx_query.MsgSetMarketMapperRevenueShareResponse: Market mapper revenue share response
        """
        return revshare_tx_grpc.MsgStub(self.channel).SetMarketMapperRevenueShare(
            revshare_tx_query.MsgSetMarketMapperRevenueShare(
                authority=authority,
                params=revshare_param.MarketMapperRevenueShareParams(
                    address=address,
                    revenue_share_ppm=revenue_share_ppm,
                    valid_days=valid_days,
                ),
            ),
        )

    async def set_market_mapper_revenue_share_details_for_market(
        self, authority: str, market_id: int, expiration_ts: int
    ) -> revshare_tx_query.MsgSetMarketMapperRevShareDetailsForMarketResponse:
        """
        Set market mapper revenue share details

        Args:
            authority (str): Setter's authority
            market_id (int): Market id of the revenue share
            expiration_ts (int): Expiration

        Returns:
            revshare_query.MsgSetMarketMapperRevShareDetailsForMarketResponse: Market mapper revenue share details response
        """
        return revshare_tx_grpc.MsgStub(
            self.channel
        ).SetMarketMapperRevShareDetailsForMarket(
            revshare_tx_query.MsgSetMarketMapperRevShareDetailsForMarket(
                authority=authority,
                market_id=market_id,
                params=revshare_pb2.MarketMapperRevShareDetails(
                    expiration_ts=expiration_ts
                ),
            )
        )

    async def update_unconditional_revenue_share_config(
        self, authority: str, address: str, share_ppm: int
    ) -> revshare_tx_query.MsgUpdateUnconditionalRevShareConfigResponse:
        """
        Update unconditional revenue share config

        Args:
            authority (str): Setter's authority
            address (str): Address to receive revenue share
            share_ppm (int): Parts per million of share

        Returns:
            revshare_tx_query.MsgUpdateUnconditionalRevShareConfigResponse: Update unconditional revenue share config response
        """
        return revshare_tx_grpc.MsgStub(self.channel).UpdateUnconditionalRevShareConfig(
            revshare_tx_query.MsgUpdateUnconditionalRevShareConfig(
                authority=authority,
                config=revshare_pb2.UnconditionalRevShareConfig(
                    configs=[
                        revshare_pb2.UnconditionalRevShareConfig.RecipientConfig(
                            address=address, share_ppm=share_ppm
                        )
                    ]
                ),
            )
        )
