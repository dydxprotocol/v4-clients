# Using the Testnet Faucet

The testnet faucet allows you to obtain tokens for testing purposes on the dYdX testnet. This guide will show you how to use the `FaucetClient` to obtain USDC.

## Setting up the Faucet Client

First, import the necessary modules and set up the `FaucetClient`:

```python
import asyncio
from dydx_v4_client.faucet_client import FaucetClient
from dydx_v4_client.network import TESTNET_FAUCET

# Replace this with your actual testnet address
TEST_ADDRESS = "your_testnet_address_here"

async def get_tokens_from_faucet():
    faucet = FaucetClient(TESTNET_FAUCET)
    
    # Get non-native tokens (USDC)
    response_non_native = await faucet.fill(TEST_ADDRESS, 0, 2000)
    
    # Get native tokens (DV4TNT)
    response_native = await faucet.fill_native(TEST_ADDRESS)

    print("Non-native token response:", response_non_native)
    print("Native token response:", response_native)
    
    if 200 <= response_non_native.status_code < 300:
        print("Successfully obtained USDC from faucet")
    else:
        print("Failed to obtain USDC from faucet")

    if 200 <= response_native.status_code < 300:
        print("Successfully obtained native tokens from faucet")
    else:
        print("Failed to obtain native tokens from faucet")

asyncio.run(get_tokens_from_faucet())
```

### Understanding Native and Non-Native Tokens

**Non-Native Tokens (USDC):**
- Obtained using the `fill()` method
- These are typically stablecoins used for trading on the platform
- In this example, we're requesting 2000 USDC


**Native Tokens:**
- Obtained using the `fill_native()` method
- These are the native tokens of the dYdX testnet, used for gas fees and other network operations
- The amount is predetermined by the faucet and cannot be specified in the request



### Parameters Explained
For the `fill()` method (non-native tokens):

The first parameter is your testnet address.
The second parameter (0 in this example) represents the subaccount ID.
The third parameter (2000 in this example) is the amount of USDC you're requesting.

For the `fill_native()` method:

It only requires your testnet address as a parameter.

### Important Notes

- The faucet is only available on the testnet. Do not attempt to use it on mainnet.
- There may be rate limits or maximum amounts you can request from the faucet. If you receive an error, wait a while before trying again.
- Always check the `status_code` of the response to ensure your request was successful.
- The amount of tokens you can receive may be subject to change. Refer to the latest documentation for current limits.

