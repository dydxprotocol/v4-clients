import { AbacusThreadingProtocol, ThreadingType } from './abacus';

class AbacusThreading implements AbacusThreadingProtocol {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async(_type: ThreadingType, block: () => void) {
    block();
  }
}

export default AbacusThreading;
