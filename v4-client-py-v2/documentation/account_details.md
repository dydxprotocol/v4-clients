# Getting Account and Subaccount Information

This guide demonstrates how to retrieve information about your account, subaccounts, and orders using the dYdX Python SDK.

## Understanding Accounts and Subaccounts

**Accounts**
- Your primary identity on dYdX, linked to your blockchain wallet address.
- Acts as a container for all your trading activities and subaccounts.

**Subaccounts**
- Separate trading entities within your main account.
- Each has its own balance, positions, orders, and trading history.
- Every account starts with subaccount 0; additional subaccounts can be created.

**Key Points**
- Subaccounts allow segregation of trading strategies and risk management.
- Losses in one subaccount don't affect others.
- Useful for separating personal trading, algorithms, or different fund allocations.

**API Usage**
- Most operations require both the account address and subaccount number.
- Example: `get_subaccount_orders(address, subaccount_number)`

## Setting Up

First, import the necessary modules and set up the client:

```python
import asyncio
from dydx_v4_client.indexer.rest.indexer_client import IndexerClient
from dydx_v4_client.network import TESTNET

async def setup_client():
    return IndexerClient(TESTNET.rest_indexer)

client = asyncio.run(setup_client())
```

### Getting Open Orders
To retrieve all open orders for an account:
```python
async def get_open_orders(address):
    orders = await client.account.get_subaccount_orders(
        address,
        0, # Subaccount ID
        status="OPEN"
    )
    print("Open orders:", orders)

# Replace with your actual address
address = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
asyncio.run(get_open_orders(address))
```

### Getting Order History
To retrieve the order history for an account:
```python
async def get_order_history(address):
    orders = await client.account.get_subaccount_orders(address)
    print("Order history:", orders)

# Replace with your actual address
address = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
asyncio.run(get_order_history(address))
```

### Getting Specific Order Details
To get details about a specific order:

```python
async def get_order_details(order_id):
    order = await client.account.get_order(order_id)
    print("Order details:", order)

# Replace with your actual address and order ID
order_id = "1194067c-fd0f-5ac9-a110-37902fecc79d"
asyncio.run(get_order_details(order_id))
```

### Getting Filled Orders
To retrieve filled orders for an account:
```python
async def get_filled_orders(address):
    orders = await client.account.get_subaccount_orders(
        address,
        0,
        status="FILLED"
    )
    print("Filled orders:", orders)

# Replace with your actual address
address = "dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art"
asyncio.run(get_filled_orders(address))
```

These methods allow you to retrieve various types of order information for your account. Use them to track your trading activity and manage your orders effectively.

