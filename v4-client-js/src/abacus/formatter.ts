
import { AbacusFormatterProtocol } from './abacus';
import { MustBigNumber, getFractionDigits } from './numbers';

class AbacusFormatter implements AbacusFormatterProtocol {
  percent(value: number, digits: number): string {
    return MustBigNumber(value).toFixed(digits);
  }

  dollar(value: number, tickSize: string): string {
    const tickSizeDecimals = getFractionDigits(tickSize);
    return MustBigNumber(value).toFixed(tickSizeDecimals);
  }
}

export default AbacusFormatter;
