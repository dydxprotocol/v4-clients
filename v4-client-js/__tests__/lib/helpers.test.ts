import { PartialTransactionOptions, TransactionOptions } from '../../src';
import { DEFAULT_SEQUENCE } from '../../src/lib/constants';
import { convertPartialTransactionOptionsToFull, stripHexPrefix } from '../../src/lib/helpers';
import { defaultTransactionOptions } from '../helpers/constants';
import { calculateSubticks, calculateQuantums } from '../../src/clients/helpers/chain-helpers';
import Long from 'long';

describe('helpers', () => {
  describe('calculateSubticks', () => {
    it('correctly handles decimals', () => {
      expect(calculateSubticks(8.45, -7, -9, 1000000)).toEqual(new Long(845_000_000));
    });
  });

  describe('calculateQuantums', () => {
    it('correctly handles decimals', () => {
      expect(calculateQuantums(0.0003, -10, 1000000)).toEqual(new Long(3_000_000));
    });
  });
  
  describe('convertPartialTransactionOptionsToFull', () =>
    it.each([
      [
        'partial transactionOptions',
        {
          accountNumber: defaultTransactionOptions.accountNumber,
          chainId: defaultTransactionOptions.chainId,
        },
        { ...defaultTransactionOptions, sequence: DEFAULT_SEQUENCE },
      ],
      ['undefined transactionOptions', undefined, undefined],
    ])(
      'convertPartialTransactionOptionsToFull: %s',
      (
        _name: string,
        partialTransactionOptions: PartialTransactionOptions | undefined,
        expectedResult: TransactionOptions | undefined,
      ) => {
        const transactionOptions: TransactionOptions | void =
          convertPartialTransactionOptionsToFull(partialTransactionOptions);
        expect(expectedResult).toEqual(transactionOptions);
      },
    ));

  describe('stripHexPrefix', () => {
    it('strips 0x prefix', () => {
      expect(stripHexPrefix('0x123')).toEqual('123');
    });
    it('returns input if no prefix', () => {
      expect(stripHexPrefix('10x23')).toEqual('10x23');
    });
  });
});
