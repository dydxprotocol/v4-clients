//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { HttpEndpoint } from "@cosmjs/tendermint-rpc";
import * as dydxprotocolAffiliatesTxRegistry from "./affiliates/tx.registry";
import * as dydxprotocolBlocktimeTxRegistry from "./blocktime/tx.registry";
import * as dydxprotocolBridgeTxRegistry from "./bridge/tx.registry";
import * as dydxprotocolClobTxRegistry from "./clob/tx.registry";
import * as dydxprotocolDelaymsgTxRegistry from "./delaymsg/tx.registry";
import * as dydxprotocolFeetiersTxRegistry from "./feetiers/tx.registry";
import * as dydxprotocolGovplusTxRegistry from "./govplus/tx.registry";
import * as dydxprotocolListingTxRegistry from "./listing/tx.registry";
import * as dydxprotocolPerpetualsTxRegistry from "./perpetuals/tx.registry";
import * as dydxprotocolPricesTxRegistry from "./prices/tx.registry";
import * as dydxprotocolRatelimitTxRegistry from "./ratelimit/tx.registry";
import * as dydxprotocolRevshareTxRegistry from "./revshare/tx.registry";
import * as dydxprotocolRewardsTxRegistry from "./rewards/tx.registry";
import * as dydxprotocolSendingTxRegistry from "./sending/tx.registry";
import * as dydxprotocolStatsTxRegistry from "./stats/tx.registry";
import * as dydxprotocolVaultTxRegistry from "./vault/tx.registry";
import * as dydxprotocolVestTxRegistry from "./vest/tx.registry";
import * as dydxprotocolAffiliatesTxAmino from "./affiliates/tx.amino";
import * as dydxprotocolBlocktimeTxAmino from "./blocktime/tx.amino";
import * as dydxprotocolBridgeTxAmino from "./bridge/tx.amino";
import * as dydxprotocolClobTxAmino from "./clob/tx.amino";
import * as dydxprotocolDelaymsgTxAmino from "./delaymsg/tx.amino";
import * as dydxprotocolFeetiersTxAmino from "./feetiers/tx.amino";
import * as dydxprotocolGovplusTxAmino from "./govplus/tx.amino";
import * as dydxprotocolListingTxAmino from "./listing/tx.amino";
import * as dydxprotocolPerpetualsTxAmino from "./perpetuals/tx.amino";
import * as dydxprotocolPricesTxAmino from "./prices/tx.amino";
import * as dydxprotocolRatelimitTxAmino from "./ratelimit/tx.amino";
import * as dydxprotocolRevshareTxAmino from "./revshare/tx.amino";
import * as dydxprotocolRewardsTxAmino from "./rewards/tx.amino";
import * as dydxprotocolSendingTxAmino from "./sending/tx.amino";
import * as dydxprotocolStatsTxAmino from "./stats/tx.amino";
import * as dydxprotocolVaultTxAmino from "./vault/tx.amino";
import * as dydxprotocolVestTxAmino from "./vest/tx.amino";
export const dydxprotocolAminoConverters = {
  ...dydxprotocolAffiliatesTxAmino.AminoConverter,
  ...dydxprotocolBlocktimeTxAmino.AminoConverter,
  ...dydxprotocolBridgeTxAmino.AminoConverter,
  ...dydxprotocolClobTxAmino.AminoConverter,
  ...dydxprotocolDelaymsgTxAmino.AminoConverter,
  ...dydxprotocolFeetiersTxAmino.AminoConverter,
  ...dydxprotocolGovplusTxAmino.AminoConverter,
  ...dydxprotocolListingTxAmino.AminoConverter,
  ...dydxprotocolPerpetualsTxAmino.AminoConverter,
  ...dydxprotocolPricesTxAmino.AminoConverter,
  ...dydxprotocolRatelimitTxAmino.AminoConverter,
  ...dydxprotocolRevshareTxAmino.AminoConverter,
  ...dydxprotocolRewardsTxAmino.AminoConverter,
  ...dydxprotocolSendingTxAmino.AminoConverter,
  ...dydxprotocolStatsTxAmino.AminoConverter,
  ...dydxprotocolVaultTxAmino.AminoConverter,
  ...dydxprotocolVestTxAmino.AminoConverter
};
export const dydxprotocolProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...dydxprotocolAffiliatesTxRegistry.registry, ...dydxprotocolBlocktimeTxRegistry.registry, ...dydxprotocolBridgeTxRegistry.registry, ...dydxprotocolClobTxRegistry.registry, ...dydxprotocolDelaymsgTxRegistry.registry, ...dydxprotocolFeetiersTxRegistry.registry, ...dydxprotocolGovplusTxRegistry.registry, ...dydxprotocolListingTxRegistry.registry, ...dydxprotocolPerpetualsTxRegistry.registry, ...dydxprotocolPricesTxRegistry.registry, ...dydxprotocolRatelimitTxRegistry.registry, ...dydxprotocolRevshareTxRegistry.registry, ...dydxprotocolRewardsTxRegistry.registry, ...dydxprotocolSendingTxRegistry.registry, ...dydxprotocolStatsTxRegistry.registry, ...dydxprotocolVaultTxRegistry.registry, ...dydxprotocolVestTxRegistry.registry];
export const getSigningDydxprotocolClientOptions = ({
  defaultTypes = defaultRegistryTypes
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...dydxprotocolProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...dydxprotocolAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningDydxprotocolClient = async ({
  rpcEndpoint,
  signer,
  defaultTypes = defaultRegistryTypes
}: {
  rpcEndpoint: string | HttpEndpoint;
  signer: OfflineSigner;
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
}) => {
  const {
    registry,
    aminoTypes
  } = getSigningDydxprotocolClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: registry as any,
    aminoTypes
  });
  return client;
};