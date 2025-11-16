# Migration Guide: SubaccountInfo Breaking Change

## Overview

This is a **breaking change** that introduces the `SubaccountInfo` class to unify account address, subaccount number, signing wallet, and authenticators. This aligns the Python v2 client with the TypeScript implementation and provides better support for permissioned keys.

## What Changed

### Before (v1.x)

All `NodeClient` methods accepted a `Wallet` parameter directly, and authenticators were passed via an optional `TxOptions` parameter:

```python
from dydx_v4_client.node.builder import TxOptions

wallet = await Wallet.from_mnemonic(node, mnemonic, address)
tx_options = TxOptions(
    authenticators=[auth_id],
    sequence=wallet.sequence,
    account_number=wallet.account_number
)
await node.place_order(wallet, order, tx_options)
```

### After (v2.0)

All `NodeClient` methods now accept a `SubaccountInfo` parameter instead of `Wallet`, and authenticators are embedded in the `SubaccountInfo`:

```python
from dydx_v4_client.node.subaccount import SubaccountInfo

wallet = await Wallet.from_mnemonic(node, mnemonic, address)
subaccount = SubaccountInfo.for_wallet(wallet, 0)
await node.place_order(subaccount, order)
```

## Migration Steps

### 1. Regular Wallet Usage

**Before:**
```python
wallet = await Wallet.from_mnemonic(node, mnemonic, address)
await node.place_order(wallet, order)
```

**After:**
```python
wallet = await Wallet.from_mnemonic(node, mnemonic, address)
subaccount = SubaccountInfo.for_wallet(wallet, 0)
await node.place_order(subaccount, order)
```

### 2. Permissioned Keys

**Before:**
```python
owner_wallet = await Wallet.from_mnemonic(node, owner_mnemonic, owner_address)
trader_wallet = await Wallet.from_mnemonic(node, trader_mnemonic, trader_address)

# After adding authenticator and getting auth_id:
tx_options = TxOptions(
    authenticators=[auth_id],
    sequence=trader_wallet.sequence,
    account_number=trader_wallet.account_number
)
await node.place_order(trader_wallet, order, tx_options)
```

**After:**
```python
owner_wallet = await Wallet.from_mnemonic(node, owner_mnemonic, owner_address)
trader_wallet = await Wallet.from_mnemonic(node, trader_mnemonic, trader_address)

# After adding authenticator and getting auth_id:
permissioned_subaccount = SubaccountInfo.for_permissioned_wallet(
    trader_wallet,  # signing wallet
    owner_address,  # account address
    0,  # subaccount number
    [auth_id]  # authenticator IDs
)
await node.place_order(permissioned_subaccount, order)
```

### 3. Methods That Changed

All the following methods now take `SubaccountInfo` instead of `Wallet`:

- `deposit(subaccount, ...)`
- `withdraw(subaccount, ...)`
- `send_token(subaccount, ...)`
- `transfer(subaccount, ...)`
- `place_order(subaccount, order)` - removed `tx_options` parameter
- `cancel_order(subaccount, order_id, ...)` - removed `tx_options` parameter
- `batch_cancel_orders(subaccount, ...)` - removed `tx_options` parameter
- `add_authenticator(subaccount, authenticator)`
- `remove_authenticator(subaccount, authenticator_id)`
- `create_transaction(subaccount, message)`
- `create_market_permissionless(subaccount, ...)`
- `delegate(subaccount, ...)`
- `undelegate(subaccount, ...)`
- `withdraw_delegate_reward(subaccount, ...)`
- `register_affiliate(subaccount, ...)`
- `close_position(subaccount, market, client_id, reduce_by, slippage_pct)` - removed `address` and `subaccount_number` parameters

### 4. Builder Methods

**Before:**
```python
tx = builder.build_transaction(wallet, messages, fee, tx_options)
```

**After:**
```python
subaccount = SubaccountInfo.for_wallet(wallet, 0)
tx = builder.build_transaction(subaccount, messages, fee)
```

### 5. MegaVault Client

**Before:**
```python
await megavault.deposit(wallet, address, subaccount_number, amount)
```

**After:**
```python
subaccount = SubaccountInfo.for_wallet(wallet, 0)
await megavault.deposit(subaccount, address, subaccount_number, amount)
```

## SubaccountInfo API

### Factory Methods

#### `SubaccountInfo.for_wallet(wallet, subaccount_number=0)`

Creates a `SubaccountInfo` for a regular wallet (non-permissioned).

```python
subaccount = SubaccountInfo.for_wallet(wallet, 0)
```

#### `SubaccountInfo.for_permissioned_wallet(signing_wallet, account_address, subaccount_number=0, authenticators=None)`

Creates a `SubaccountInfo` for a permissioned wallet.

```python
permissioned_subaccount = SubaccountInfo.for_permissioned_wallet(
    signing_wallet=trader_wallet,
    account_address=owner_address,
    subaccount_number=0,
    authenticators=[auth_id]
)
```

### Properties

- `address`: The account address (can differ from signing wallet address for permissioned keys)
- `subaccount_number`: The subaccount number
- `signing_wallet`: The wallet used for signing transactions
- `authenticators`: Optional list of authenticator IDs
- `is_permissioned_wallet`: Returns `True` if address != signing_wallet.address

### Helper Methods

- `clone_with_subaccount(subaccount_number)`: Create a copy with a different subaccount number

## Removed Features

- `TxOptions` class is deprecated and will be removed in a future version. Use `SubaccountInfo` instead.

## Benefits

1. **Cleaner API**: Single parameter (`SubaccountInfo`) instead of multiple (`Wallet` + `TxOptions`)
2. **Better Permissioned Key Support**: Authenticators are part of the subaccount context
3. **Type Safety**: Clear distinction between account address and signing wallet
4. **Consistency**: Aligns with TypeScript client implementation

## Helper Utilities

New helper utilities are available in `dydx_v4_client.node.trading_key_utils`:

- `create_new_random_dydx_wallet()`: Generate a new random wallet for trading keys
- `get_authorize_new_trading_key_arguments(pub_key)`: Create standard trading key authenticator structure
- `get_authorized_trading_keys_metadata(authenticators)`: Parse authorized trading keys

## Examples

See the updated examples in the `examples/` directory, particularly:
- `permissioned_keys_example.py` - Complete permissioned keys workflow
- All other examples have been updated to use `SubaccountInfo`

## Version

This breaking change is introduced in **v2.0.0**.

