import { AbacusLocalizerProtocol } from './abacus';

class AbacusLocalizer implements Omit<AbacusLocalizerProtocol, '__doNotUseOrImplementIt'> {
  localize(path: string, _paramsAsJson: string): string {
    return path;
  }
}

export default AbacusLocalizer;
