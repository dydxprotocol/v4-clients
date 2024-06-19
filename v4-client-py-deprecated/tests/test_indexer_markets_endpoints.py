
from v4_client_py.clients import IndexerClient
from v4_client_py.clients.constants import Network, MARKET_BTC_USD

client = IndexerClient(
    config=Network.testnet().indexer_config,
)

def test_get_perpetual_markets():
    # Get perp markets
    try:
        markets_response = client.markets.get_perpetual_markets()
        print(markets_response.data)
        btc_market = markets_response.data['markets']['BTC-USD']
        btc_market_status = btc_market['status']
    except:
        print('failed to get markets')
        assert False

def test_get_perpetual_market():
    try:
        btc_market_response = client.markets.get_perpetual_markets(MARKET_BTC_USD)
        print(btc_market_response.data)
        btc_market = btc_market_response.data['markets']['BTC-USD']
        btc_market_status = btc_market['status']
    except:
        print('failed to get BTC market')
        assert False

def test_get_perpetual_markets_sparklines():
    # Get sparklines
    try:
        sparklines_response = client.markets.get_perpetual_markets_sparklines()
        print(sparklines_response.data)
        sparklines = sparklines_response.data
        btc_sparkline = sparklines['BTC-USD']
    except:
        print('failed to get sparklines')
        assert False


def test_get_perpetual_market_trades():
    # Get perp market trades
    try:
        btc_market_trades_response = client.markets.get_perpetual_market_trades(MARKET_BTC_USD)
        print(btc_market_trades_response.data)
        btc_market_trades = btc_market_trades_response.data['trades']
        if len(btc_market_trades) > 0:
            btc_market_trades_0 = btc_market_trades[0]
    except:
        print('failed to get market trades')
        assert False
        
def test_get_perpetual_market_orderbook():
    # Get perp market orderbook
    try:
        btc_market_orderbook_response = client.markets.get_perpetual_market_orderbook(MARKET_BTC_USD)
        print(btc_market_orderbook_response.data)
        btc_market_orderbook = btc_market_orderbook_response.data
        btc_market_orderbook_asks = btc_market_orderbook['asks']
        btc_market_orderbook_bids = btc_market_orderbook['bids']
        if len(btc_market_orderbook_asks) > 0:
            btc_market_orderbook_asks_0 = btc_market_orderbook_asks[0]
            print(btc_market_orderbook_asks_0)
            btc_market_orderbook_asks_0_price = btc_market_orderbook_asks_0['price']
            btc_market_orderbook_asks_0_size = btc_market_orderbook_asks_0['size']
    except:
        print('failed to get market orderbook')
        assert False

def test_get_market_candles():
    # Get perp market candles
    try:
        btc_market_candles_response = client.markets.get_perpetual_market_candles(MARKET_BTC_USD, '1MIN')
        print(btc_market_candles_response.data)
        btc_market_candles = btc_market_candles_response.data['candles']
        if len(btc_market_candles) > 0:
            btc_market_candles_0 = btc_market_candles[0]
            print(btc_market_candles_0)
            btc_market_candles_0_startedAt = btc_market_candles_0['startedAt']
            btc_market_candles_0_low = btc_market_candles_0['low']
            btc_market_candles_0_hight = btc_market_candles_0['high']
            btc_market_candles_0_open = btc_market_candles_0['open']
            btc_market_candles_0_close = btc_market_candles_0['close']
            btc_market_candles_0_baseTokenVolume = btc_market_candles_0['baseTokenVolume']
            btc_market_candles_0_usdVolume = btc_market_candles_0['usdVolume']
            btc_market_candles_0_trades = btc_market_candles_0['trades']
    except:
        print('failed to get market cancles')
        assert False


def test_get_perpetual_market_funding():
    # Get perp market funding
    try:
        btc_market_funding_response = client.markets.get_perpetual_market_funding(MARKET_BTC_USD)
        print(btc_market_funding_response.data)
        btc_market_funding= btc_market_funding_response.data['historicalFunding']
        if len(btc_market_funding) > 0:
            btc_market_funding_0 = btc_market_funding[0]
            print(btc_market_funding_0)
    except:
        print('failed to get market historical funding')
        assert False
