import asyncio

from dydx_v4_client.node.fee import Denom, calculate_fee


async def test():
    try:
        for denom in Denom:
            gas_limit, fee_amount = calculate_fee(100000, denom)
            print(f"Denom: {denom.name}")
            print(f"Gas Limit: {gas_limit}")
            print(f"Amount: {fee_amount} {denom.name}")
            print()
    except ValueError as e:
        print(f"Error: {e}")


asyncio.run(test())
