//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../binary";
import { bytesFromBase64, base64FromBytes } from "../../helpers";
/** ListingVaultDepositParams represents the params for PML megavault deposits */
export interface ListingVaultDepositParams {
  /** Amount that will be deposited into the new market vault exclusively */
  newVaultDepositAmount: Uint8Array;
  /**
   * Amount deposited into the main vault exclusively. This amount does not
   * include the amount deposited into the new vault.
   */
  mainVaultDepositAmount: Uint8Array;
  /** Lockup period for this deposit */
  numBlocksToLockShares: number;
}
export interface ListingVaultDepositParamsProtoMsg {
  typeUrl: "/dydxprotocol.listing.ListingVaultDepositParams";
  value: Uint8Array;
}
/** ListingVaultDepositParams represents the params for PML megavault deposits */
export interface ListingVaultDepositParamsAmino {
  /** Amount that will be deposited into the new market vault exclusively */
  new_vault_deposit_amount?: string;
  /**
   * Amount deposited into the main vault exclusively. This amount does not
   * include the amount deposited into the new vault.
   */
  main_vault_deposit_amount?: string;
  /** Lockup period for this deposit */
  num_blocks_to_lock_shares?: number;
}
export interface ListingVaultDepositParamsAminoMsg {
  type: "/dydxprotocol.listing.ListingVaultDepositParams";
  value: ListingVaultDepositParamsAmino;
}
/** ListingVaultDepositParams represents the params for PML megavault deposits */
export interface ListingVaultDepositParamsSDKType {
  new_vault_deposit_amount: Uint8Array;
  main_vault_deposit_amount: Uint8Array;
  num_blocks_to_lock_shares: number;
}
function createBaseListingVaultDepositParams(): ListingVaultDepositParams {
  return {
    newVaultDepositAmount: new Uint8Array(),
    mainVaultDepositAmount: new Uint8Array(),
    numBlocksToLockShares: 0
  };
}
export const ListingVaultDepositParams = {
  typeUrl: "/dydxprotocol.listing.ListingVaultDepositParams",
  encode(message: ListingVaultDepositParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.newVaultDepositAmount.length !== 0) {
      writer.uint32(10).bytes(message.newVaultDepositAmount);
    }
    if (message.mainVaultDepositAmount.length !== 0) {
      writer.uint32(18).bytes(message.mainVaultDepositAmount);
    }
    if (message.numBlocksToLockShares !== 0) {
      writer.uint32(24).uint32(message.numBlocksToLockShares);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ListingVaultDepositParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListingVaultDepositParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.newVaultDepositAmount = reader.bytes();
          break;
        case 2:
          message.mainVaultDepositAmount = reader.bytes();
          break;
        case 3:
          message.numBlocksToLockShares = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ListingVaultDepositParams>): ListingVaultDepositParams {
    const message = createBaseListingVaultDepositParams();
    message.newVaultDepositAmount = object.newVaultDepositAmount ?? new Uint8Array();
    message.mainVaultDepositAmount = object.mainVaultDepositAmount ?? new Uint8Array();
    message.numBlocksToLockShares = object.numBlocksToLockShares ?? 0;
    return message;
  },
  fromAmino(object: ListingVaultDepositParamsAmino): ListingVaultDepositParams {
    const message = createBaseListingVaultDepositParams();
    if (object.new_vault_deposit_amount !== undefined && object.new_vault_deposit_amount !== null) {
      message.newVaultDepositAmount = bytesFromBase64(object.new_vault_deposit_amount);
    }
    if (object.main_vault_deposit_amount !== undefined && object.main_vault_deposit_amount !== null) {
      message.mainVaultDepositAmount = bytesFromBase64(object.main_vault_deposit_amount);
    }
    if (object.num_blocks_to_lock_shares !== undefined && object.num_blocks_to_lock_shares !== null) {
      message.numBlocksToLockShares = object.num_blocks_to_lock_shares;
    }
    return message;
  },
  toAmino(message: ListingVaultDepositParams): ListingVaultDepositParamsAmino {
    const obj: any = {};
    obj.new_vault_deposit_amount = message.newVaultDepositAmount ? base64FromBytes(message.newVaultDepositAmount) : undefined;
    obj.main_vault_deposit_amount = message.mainVaultDepositAmount ? base64FromBytes(message.mainVaultDepositAmount) : undefined;
    obj.num_blocks_to_lock_shares = message.numBlocksToLockShares === 0 ? undefined : message.numBlocksToLockShares;
    return obj;
  },
  fromAminoMsg(object: ListingVaultDepositParamsAminoMsg): ListingVaultDepositParams {
    return ListingVaultDepositParams.fromAmino(object.value);
  },
  fromProtoMsg(message: ListingVaultDepositParamsProtoMsg): ListingVaultDepositParams {
    return ListingVaultDepositParams.decode(message.value);
  },
  toProto(message: ListingVaultDepositParams): Uint8Array {
    return ListingVaultDepositParams.encode(message).finish();
  },
  toProtoMsg(message: ListingVaultDepositParams): ListingVaultDepositParamsProtoMsg {
    return {
      typeUrl: "/dydxprotocol.listing.ListingVaultDepositParams",
      value: ListingVaultDepositParams.encode(message).finish()
    };
  }
};