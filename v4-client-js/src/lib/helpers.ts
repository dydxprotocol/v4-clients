import { toHex } from '@cosmjs/encoding';
import BigNumber from 'bignumber.js';
import Long from 'long';

import { PartialTransactionOptions, TransactionOptions } from '../types';
import { DEFAULT_SEQUENCE } from './constants';

/**
 * @description Either return undefined or insert default sequence value into
 * `partialTransactionOptions` if it does not exist.
 *
 * @returns undefined or full TransactionOptions.
 */
export function convertPartialTransactionOptionsToFull(
  partialTransactionOptions?: PartialTransactionOptions,
): TransactionOptions | undefined {
  if (partialTransactionOptions === undefined) {
    return undefined;
  }

  return {
    sequence: DEFAULT_SEQUENCE,
    ...partialTransactionOptions,
  };
}

/**
 * @description Strip '0x' prefix from input string. If there is no '0x' prefix, return the original
 * input.
 *
 * @returns input without '0x' prefix or original input if no prefix.
 */
export function stripHexPrefix(input: string): string {
  if (input.indexOf('0x') === 0) {
    return input.slice(2);
  }

  return input;
}

export function encodeJson(object?: Object): string {
  // eslint-disable-next-line prefer-arrow-callback
  return JSON.stringify(object, function replacer(_key, value) {
    // Even though we set the an UInt8Array as the value,
    // it comes in here as an object with UInt8Array as the buffer property.
    if (value instanceof BigNumber) {
      return value.toString();
    }
    if (value instanceof Long) {
      return value.toString();
    }
    if (value?.buffer instanceof Uint8Array) {
      return toHex(value.buffer);
    } else if (value instanceof Uint8Array) {
      return toHex(value);
    }
    return value;
  });
}
