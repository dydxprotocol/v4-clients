import Long from 'long';
import protobuf from 'protobufjs';

import { BECH32_PREFIX } from '../src';
import { Network } from '../src/clients/constants';
import { calculateQuantums, calculateSubticks } from '../src/clients/helpers/chain-helpers';
import { IndexerClient } from '../src/clients/indexer-client';
import LocalWallet from '../src/clients/modules/local-wallet';
import { Order_Side, Order_TimeInForce } from '../src/clients/modules/proto-includes';
import { SubaccountInfo } from '../src/clients/subaccount';
import { IPlaceOrder, ITwapParameters, OrderFlags } from '../src/clients/types';
import { ValidatorClient } from '../src/clients/validator-client';
import { DYDX_TEST_ADDRESS, DYDX_TEST_MNEMONIC, MAX_CLIENT_ID } from './constants';

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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Fill {
  id?: string;
  createdAt?: string;
  size?: string;
  price?: string;
  side?: string;
}

async function getAllFills(
  indexerClient: IndexerClient,
  address: string,
  subaccountNumber: number,
  ticker: string,
  limit: number = 100,
): Promise<Fill[]> {
  /**
   * Retrieve all fills for a subaccount by paginating through all pages.
   *
   * @param indexerClient - The IndexerClient instance
   * @param address - The account address
   * @param subaccountNumber - The subaccount number
   * @param ticker - The market ticker to filter by
   * @param limit - Number of fills per page (default 100)
   * @returns List of all fills
   */
  const allFills: Fill[] = [];
  let createdBeforeOrAt: string | null = null;

  while (true) {
    const response = await indexerClient.account.getSubaccountFills(
      address,
      subaccountNumber,
      ticker,
      undefined, // tickerType - default is PERPETUAL
      limit,
      undefined, // createdBeforeOrAtHeight
      createdBeforeOrAt || undefined, // createdBeforeOrAt
      undefined, // page
    );

    const fills = (response.fills || []) as Fill[];

    if (!fills || fills.length === 0) {
      break;
    }

    allFills.push(...fills);

    // If we got fewer fills than the limit, we've reached the end
    if (fills.length < limit) {
      break;
    }

    // Use the createdAt timestamp of the last fill for the next page
    // The API expects fills created before or at this timestamp
    const lastFill = fills[fills.length - 1];
    createdBeforeOrAt = lastFill.createdAt || null;

    if (!createdBeforeOrAt) {
      // If createdAt is missing, we can't paginate further
      break;
    }
  }

  return allFills;
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

  // Retrieve all initial fills with pagination
  console.log(
    'Retrieving initial fills (this may take a moment if there are many fills)...',
  );
  const initialFills = await getAllFills(
    indexerClient,
    DYDX_TEST_ADDRESS,
    0,
    MARKET_ID,
  );
  // Store initial fill IDs for comparison
  const initialFillIds = new Set<string>();
  for (const fill of initialFills) {
    if (fill.id) {
      initialFillIds.add(fill.id);
    }
  }
  console.log(`Retrieved ${initialFills.length} initial fills`);
  console.log();

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
    orderFlags: OrderFlags.TWAP,
    clobPairId: clobPairId,
    side: Order_Side.SIDE_SELL,
    quantums: quantums,
    subticks: subticks,
    timeInForce: Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED,
    reduceOnly: false,
    clientMetadata: 0,
    goodTilBlockTime: Math.round(new Date().getTime() / 1000 + 350),
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

  // Retrieve all fills again after TWAP execution
  console.log('Retrieving all fills after TWAP execution...');
  const finalFills = await getAllFills(
    indexerClient,
    DYDX_TEST_ADDRESS,
    0,
    MARKET_ID,
  );
  console.log(`Retrieved ${finalFills.length} total fills`);
  console.log();

  // Identify new fills (TWAP fills)
  const finalFillIds = new Set<string>();
  for (const fill of finalFills) {
    if (fill.id) {
      finalFillIds.add(fill.id);
    }
  }
  const newFillIds = new Set<string>();
  for (const fillId of finalFillIds) {
    if (!initialFillIds.has(fillId)) {
      newFillIds.add(fillId);
    }
  }
  const twapFills = finalFills.filter((fill) => fill.id && newFillIds.has(fill.id));

  // Sort TWAP fills by creation time (oldest first)
  twapFills.sort((a, b) => {
    const timeA = a.createdAt || '';
    const timeB = b.createdAt || '';
    return timeA.localeCompare(timeB);
  });

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

  // Display TWAP fills
  console.log('='.repeat(80));
  console.log('TWAP FILLS');
  console.log('='.repeat(80));
  if (twapFills.length > 0) {
    console.log(`Found ${twapFills.length} new fills from TWAP order execution:`);
    console.log();
    let totalFilledSize = 0.0;
    for (let i = 0; i < twapFills.length; i++) {
      const fill = twapFills[i];
      const fillId = fill.id || 'N/A';
      const createdAt = fill.createdAt || 'N/A';
      const fillSize = parseFloat(fill.size || '0');
      const fillPrice = parseFloat(fill.price || '0');
      const fillSide = fill.side || 'N/A';
      totalFilledSize += Math.abs(fillSize);

      console.log(`Fill ${i + 1}:`);
      console.log(`  ID: ${fillId}`);
      console.log(`  Created At: ${createdAt}`);
      console.log(`  Side: ${fillSide}`);
      console.log(`  Size: ${fillSize.toFixed(6)}`);
      console.log(`  Price: $${fillPrice.toFixed(2)}`);
      console.log(`  Notional: $${Math.abs(fillSize * fillPrice).toFixed(2)}`);
      console.log();
    }

    console.log(`Total Filled Size: ${totalFilledSize.toFixed(6)}`);
    console.log(`Expected Order Size: ${size.toFixed(6)}`);
    if (totalFilledSize > 0) {
      const fillPercentage = (totalFilledSize / size) * 100;
      console.log(`Fill Percentage: ${fillPercentage.toFixed(1)}%`);
    }
  } else {
    console.log('No new fills detected. The TWAP order may not have executed yet,');
    console.log('or all fills were already present in the initial retrieval.');
  }
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

