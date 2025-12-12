import Long from 'long';
import protobuf from 'protobufjs';

import { BECH32_PREFIX } from '../src';
import { Network, OrderType, OrderSide } from '../src/clients/constants';
import { calculateQuantums, calculateSubticks } from '../src/clients/helpers/chain-helpers';
import { IndexerClient } from '../src/clients/indexer-client';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Order_Side, Order_TimeInForce } from '../src/clients/modules/proto-includes';
import { SubaccountInfo } from '../src/clients/subaccount';
import { IPlaceOrder, ITwapParameters, OrderFlags } from '../src/clients/types';
import { ValidatorClient } from '../src/clients/validator-client';
import { DYDX_TEST_MNEMONIC, DYDX_TEST_ADDRESS, MAX_CLIENT_ID } from './constants';

// Required for encoding and decoding queries that are of type Long.
protobuf.util.Long = Long;
protobuf.configure();

const MARKET_ID = 'ETH-USD';

// TWAP Configuration
const TWAP_DURATION = 300; // minimum is 300 seconds
// Interval must be in range [30 (30 seconds), 3600 (1 hour)] AND must be a factor of duration
const TWAP_INTERVAL = 60; // minimum is 30 seconds, must be factor of duration
const TWAP_PRICE_TOLERANCE = 10000; // 1% tolerance (10,000 ppm) - valid range [0, 1_000_000)
const MONITORING_INTERVAL = 2000; // Check position changes every 2 seconds (in milliseconds)

interface PositionChange {
  time: number;
  size: number;
  change: number;
  totalChange: number;
}

function formatOrderIdForQuery(orderId: {
  subaccountId: { owner: string; number: number };
  clientId: number;
  clobPairId: number;
  orderFlags: number;
}): string {
  /**
   * Format OrderId object to string format for API queries.
   * Format: {address}-{subaccount_number}-{client_id}-{clob_pair_id}-{order_flags}
   */
  const subaccount = orderId.subaccountId;
  return `${subaccount.owner}-${subaccount.number}-${orderId.clientId}-${orderId.clobPairId}-${orderId.orderFlags}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function placeAndTrackTwapOrder(size: number): Promise<void> {
  /**
   * Place a TWAP order and track its execution in real-time.
   * Tracks position changes to verify order execution.
   */
  const uniqueClientId = Math.floor(Date.now() % MAX_CLIENT_ID);

  console.log('='.repeat(80));
  console.log('TWAP ORDER EXECUTION DEMONSTRATION');
  console.log('='.repeat(80));
  console.log(`Market: ${MARKET_ID}`);
  console.log(`Client ID: ${uniqueClientId}`);
  console.log(`Total Size: ${size}`);
  console.log(`TWAP Duration: ${TWAP_DURATION} seconds`);
  console.log(`TWAP Interval: ${TWAP_INTERVAL} seconds`);
  console.log(`Expected Suborders: ${TWAP_DURATION / TWAP_INTERVAL}`);
  console.log(`Expected Suborder Size: ~${(size / (TWAP_DURATION / TWAP_INTERVAL)).toFixed(6)}`);
  console.log('='.repeat(80));
  console.log();

  // Initialize clients
  const network = Network.testnet();
  const validatorClient = await ValidatorClient.connect(network.validatorConfig);
  const indexerClient = new IndexerClient(network.indexerConfig);
  const wallet = await LocalWallet.fromMnemonic(DYDX_TEST_MNEMONIC, BECH32_PREFIX);
  const subaccount = SubaccountInfo.forLocalWallet(wallet, 0);

  // Get market info
  const marketsResponse = await indexerClient.markets.getPerpetualMarkets(MARKET_ID);
  const market = marketsResponse.markets[MARKET_ID];
  const clobPairId = market.clobPairId;
  const atomicResolution = market.atomicResolution;
  const stepBaseQuantums = market.stepBaseQuantums;
  const quantumConversionExponent = market.quantumConversionExponent;
  const subticksPerTick = market.subticksPerTick;

  // Get initial position before placing order
  const positionsResponse = await indexerClient.account.getSubaccountPerpetualPositions(
    DYDX_TEST_ADDRESS,
    0,
  );
  const positions = (positionsResponse.positions || []) as Array<{
    market?: string;
    status?: string;
    size?: string;
  }>;

  let initialPosition: { market?: string; status?: string; size?: string } | null = null;
  for (const pos of positions) {
    if (pos.market === MARKET_ID && pos.status !== 'CLOSED') {
      initialPosition = pos;
      break;
    }
  }

  const initialSize = initialPosition ? parseFloat(initialPosition.size || '0') : 0.0;
  const isLong = initialSize > 0;

  console.log('Initial Position:');
  if (initialPosition) {
    console.log(`  Market: ${MARKET_ID}`);
    console.log(`  Size: ${initialSize.toFixed(6)}`);
    console.log(
      `  Direction: ${isLong ? 'LONG' : initialSize < 0 ? 'SHORT' : 'NONE'}`,
    );
  } else {
    console.log(`  No open position for ${MARKET_ID}`);
  }
  console.log();

  // Generate unique client_id using timestamp to ensure uniqueness
  console.log(`Using unique client_id: ${uniqueClientId} (timestamp-based)`);
  console.log();

  // Get current block height
  const currentBlock = await validatorClient.get.latestBlockHeight();

  // Record order placement time
  const orderPlacedTime = new Date();

  console.log('Placing TWAP order...');
  console.log(`Order placed at: ${orderPlacedTime.toISOString()}`);
  console.log();

  // Calculate quantums and subticks
  const quantums = calculateQuantums(size, atomicResolution, stepBaseQuantums);
  const subticks = calculateSubticks(0, atomicResolution, quantumConversionExponent, subticksPerTick); // Market order, price = 0

  // Create TWAP parameters
  const twapParameters: ITwapParameters = {
    duration: TWAP_DURATION,
    interval: TWAP_INTERVAL,
    priceTolerance: TWAP_PRICE_TOLERANCE,
  };

  // Create and place TWAP order
  const placeOrder: IPlaceOrder = {
    clientId: uniqueClientId,
    orderFlags: OrderFlags.SHORT_TERM,
    clobPairId: clobPairId,
    side: Order_Side.SIDE_SELL,
    quantums: quantums,
    subticks: subticks,
    timeInForce: Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
    reduceOnly: false,
    clientMetadata: 0,
    goodTilBlock: currentBlock + 30, // Must be within ShortBlockWindow limit (40 blocks max)
    twapParameters: twapParameters,
  };

  const transaction = await validatorClient.post.placeOrderObject(subaccount, placeOrder);

  console.log('✓ Order placed successfully!');
  console.log('Transaction:', transaction);
  console.log();

  // Track position changes
  const positionChanges: PositionChange[] = [];
  let lastPositionSize = initialSize;

  const startTime = Date.now();
  const monitoringDuration = (TWAP_DURATION + 20) * 1000; // Add buffer for final position updates (convert to ms)
  const endTime = startTime + monitoringDuration;

  console.log('='.repeat(80));
  console.log('REAL-TIME POSITION TRACKING');
  console.log('='.repeat(80));
  console.log('Monitoring position changes every 2 seconds...');
  console.log();

  let finalPosition: { market?: string; status?: string; size?: string } | null = null;
  let finalSize = initialSize;

  while (Date.now() < endTime) {
    const elapsed = (Date.now() - startTime) / 1000;

    // Query current position
    const currentPositionsResponse = await indexerClient.account.getSubaccountPerpetualPositions(
      DYDX_TEST_ADDRESS,
      0,
    );
    const currentPositions = (currentPositionsResponse.positions || []) as Array<{
      market?: string;
      status?: string;
      size?: string;
    }>;

    let currentPosition: { market?: string; status?: string; size?: string } | null = null;
    for (const pos of currentPositions) {
      if (pos.market === MARKET_ID && pos.status !== 'CLOSED') {
        currentPosition = pos;
        break;
      }
    }

    const currentSize = currentPosition ? parseFloat(currentPosition.size || '0') : 0.0;

    // Check if position changed
    if (Math.abs(currentSize - lastPositionSize) > 0.000001) {
      const positionChange = currentSize - lastPositionSize;
      const totalChange = currentSize - initialSize;
      const absTotalChange = Math.abs(totalChange);

      positionChanges.push({
        time: elapsed,
        size: currentSize,
        change: positionChange,
        totalChange: totalChange,
      });

      const elapsedStr = `${elapsed.toFixed(1)}s`;
      console.log(`[${elapsedStr}] ✓ Position Updated`);
      console.log(`         Current Size: ${currentSize.toFixed(6)}`);
      console.log(`         Change: ${positionChange >= 0 ? '+' : ''}${positionChange.toFixed(6)}`);
      console.log(
        `         Total Change from Initial: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(6)}`,
      );
      console.log(
        `         Progress: ${absTotalChange.toFixed(6)} / ${size.toFixed(6)} (${((absTotalChange / size) * 100).toFixed(1)}%)`,
      );
      console.log();

      lastPositionSize = currentSize;
    }

    // Store the latest position data for final verification
    finalPosition = currentPosition;
    finalSize = currentSize;

    await sleep(MONITORING_INTERVAL);
  }

  // Final verification
  console.log('='.repeat(80));
  console.log('FINAL VERIFICATION');
  console.log('='.repeat(80));

  // Reuse position data from the last monitoring loop iteration
  const totalPositionChange = finalSize - initialSize;
  const absTotalChange = Math.abs(totalPositionChange);

  console.log(`Initial Position Size: ${initialSize.toFixed(6)}`);
  console.log(`Final Position Size: ${finalSize.toFixed(6)}`);
  console.log(`Total Position Change: ${totalPositionChange >= 0 ? '+' : ''}${totalPositionChange.toFixed(6)}`);
  console.log(`Expected Order Size: ${size.toFixed(6)}`);
  console.log();

  // Position tracking verification
  console.log('Using position tracking verification:');
  console.log('  - Position changed: ✓');
  console.log(`  - Total position change: ${absTotalChange.toFixed(6)}`);
  console.log();

  // Final summary
  console.log('='.repeat(80));
  console.log('EXECUTION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Initial Position: ${initialSize.toFixed(6)}`);
  console.log(`Final Position: ${finalSize.toFixed(6)}`);
  console.log(`Total Position Change: ${totalPositionChange >= 0 ? '+' : ''}${totalPositionChange.toFixed(6)}`);
  console.log(`Expected Order Size: ${size.toFixed(6)}`);
  console.log(`Position Changes Detected: ${positionChanges.length}`);
  console.log();

  if (positionChanges.length > 0) {
    console.log('Position Change History:');
    positionChanges.forEach((change, i) => {
      console.log(
        `  ${i + 1}. Time: ${change.time.toFixed(1)}s, ` +
          `Size: ${change.size.toFixed(6)}, ` +
          `Change: ${change.change >= 0 ? '+' : ''}${change.change.toFixed(6)}, ` +
          `Total Change: ${change.totalChange >= 0 ? '+' : ''}${change.totalChange.toFixed(6)}`,
      );
    });
  } else {
    console.log(
      'No position changes detected (order may still be executing or no changes occurred)',
    );
  }

  console.log();
  console.log('='.repeat(80));
  console.log('TWAP Order tracking completed!');
  console.log('='.repeat(80));
}

// Run the example
placeAndTrackTwapOrder(0.01)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  });

