# Placing Orders

This guide demonstrates how to place orders using the dYdX Python SDK.

## Building an Order

To place an order, you first need to build it. There are two ways to do this:

### 1. Direct Interface

You can use the direct interface to create an order by creating a Message object. Here's an example:

```python
from dydx_v4_client.node.message import order

order(
    id,
    side,
    quantums,
    subticks,
    time_in_force,
    reduce_only,
    good_til_block,
    good_til_block_time
)
```

2. Market-based Calculator
Alternatively, you can use the market-based calculator, which provides more convenience:

- Market order: Example in `examples/market_order_example.py`
- Short term order: Example in `examples/short_term_order_cancel_example.py`
- Long term order + cancel: Example in `examples/long_term_order_cancel_example.py`

## Next Steps
Continue reading to learn how to [cancel orders](./cancelling_orders.md) using the dYdX Python SDK.
