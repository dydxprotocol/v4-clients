//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { HttpEndpoint } from "@cosmjs/tendermint-rpc";
import * as slinkyAlertsV1TxRegistry from "./alerts/v1/tx.registry";
import * as slinkyMarketmapV1TxRegistry from "./marketmap/v1/tx.registry";
import * as slinkyOracleV1TxRegistry from "./oracle/v1/tx.registry";
import * as slinkySlaV1TxRegistry from "./sla/v1/tx.registry";
import * as slinkyAlertsV1TxAmino from "./alerts/v1/tx.amino";
import * as slinkyMarketmapV1TxAmino from "./marketmap/v1/tx.amino";
import * as slinkyOracleV1TxAmino from "./oracle/v1/tx.amino";
import * as slinkySlaV1TxAmino from "./sla/v1/tx.amino";
export const slinkyAminoConverters = {
  ...slinkyAlertsV1TxAmino.AminoConverter,
  ...slinkyMarketmapV1TxAmino.AminoConverter,
  ...slinkyOracleV1TxAmino.AminoConverter,
  ...slinkySlaV1TxAmino.AminoConverter
};
export const slinkyProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...slinkyAlertsV1TxRegistry.registry, ...slinkyMarketmapV1TxRegistry.registry, ...slinkyOracleV1TxRegistry.registry, ...slinkySlaV1TxRegistry.registry];
export const getSigningSlinkyClientOptions = ({
  defaultTypes = defaultRegistryTypes
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...slinkyProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...slinkyAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningSlinkyClient = async ({
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
  } = getSigningSlinkyClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: registry as any,
    aminoTypes
  });
  return client;
};