
from v4_client_py.clients import IndexerClient, Subaccount
from v4_client_py.clients.constants import Network

from tests.constants import DYDX_TEST_MNEMONIC

client = IndexerClient(
    config=Network.testnet().indexer_config,
)

subaccount = Subaccount.from_mnemonic(DYDX_TEST_MNEMONIC)
address = subaccount.address

def test_get_subaccounts():
    # Get subaccounts
    try:
        subaccounts_response = client.account.get_subaccounts(address)
        print(f'{subaccounts_response.data}')
        subaccounts = subaccounts_response.data['subaccounts']
        subaccount_0 = subaccounts[0]
        print(f'{subaccount_0}')
        subaccount_0_subaccountNumber = subaccount_0['subaccountNumber']
    except:
        print('failed to get subaccounts')
        assert False

def test_get_subaccount():
    try:
        subaccount_response = client.account.get_subaccount(address, 0)
        print(f'{subaccount_response.data}')
        subaccount = subaccount_response.data['subaccount']
        print(f'{subaccount}')
        subaccount_subaccountNumber = subaccount['subaccountNumber']
    except:
        print('failed to get subaccount')
        assert False

def test_get_positions():
    # Get positions
    try:
        asset_positions_response = client.account.get_subaccount_asset_positions(address, 0)
        print(f'{asset_positions_response.data}')
        asset_positions = asset_positions_response.data['positions']
        if len(asset_positions) > 0:
            asset_positions_0 = asset_positions[0]
            print(f'{asset_positions_0}')
    except:
        print('failed to get asset positions')
        assert False

def test_get_perpetual_positions():
    try:
        perpetual_positions_response = client.account.get_subaccount_perpetual_positions(address, 0)
        print(f'{perpetual_positions_response.data}')
        perpetual_positions = perpetual_positions_response.data['positions']
        if len(perpetual_positions) > 0:
            perpetual_positions_0 = perpetual_positions[0]
            print(f'{perpetual_positions_0}')
    except:
        print('failed to get perpetual positions')
        assert False

def test_get_transfers():
    # Get transfers
    try:
        transfers_response = client.account.get_subaccount_transfers(address, 0)
        print(f'{transfers_response.data}')
        transfers = transfers_response.data['transfers']
        if len(transfers) > 0:
            transfers_0 = transfers[0]
            print(f'{transfers_0}')
    except:
        print('failed to get transfers')
        assert False

def test_get_orders():
    # Get orders
    try:
        orders_response = client.account.get_subaccount_orders(address, 0)
        print(f'{orders_response.data}')
        orders = orders_response.data
        if len(orders) > 0:
            order_0 = orders[0]
            print(f'{order_0}')
            order_0_id = order_0['id']
            order_response = client.account.get_order(order_id=order_0_id)
            order = order_response.data
            order_id = order['id']
    except:
        print('failed to get orders')
        assert False


def test_get_fills():
    # Get fills
    try:
        fills_response = client.account.get_subaccount_fills(address, 0)
        print(f'{fills_response.data}')
        fills = fills_response.data['fills']
        if len(fills) > 0:
            fill_0 = fills[0]
            print(f'{fill_0}')
    except:
        print('failed to get fills')
        assert False

def test_get_funding():
    # Get funding
    try:
        funding_response = client.account.get_subaccount_funding(address, 0)
        print(f'{funding_response.data}')
        funding = funding_response.data['fundingPayments']
        if len(funding) > 0:
            funding_0 = funding[0]
            print(f'{funding_0}')
    except:
        print('failed to get funding')

def test_get_historical_pnl():
    # Get historical pnl
    try:
        historical_pnl_response = client.account.get_subaccount_historical_pnls(address, 0)
        print(f'{historical_pnl_response.data}')
        historical_pnl = historical_pnl_response.data['historicalPnl']
        if len(historical_pnl) > 0:
            historical_pnl_0 = historical_pnl[0]
            print(f'{historical_pnl_0}')
    except:
        print('failed to get historical pnl')
        assert False