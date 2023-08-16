import { Block } from '@cosmjs/stargate';

import { ValidatorClient } from './clients/validator-client';
import { encodeJson } from './lib/helpers';
import { ValidatorConfig } from './types';

class PingResponse {
    public readonly block: Block;
    public readonly responseTime: Date;
    public endpoint?: string;

    constructor(
      block: Block,
    ) {
      this.block = block;
      this.responseTime = new Date();
    }
}

export const isTruthy = <T>(n?: T | false | null | undefined | 0): n is T => Boolean(n);

export class NetworkOptimizer {
  private async validatorClients(
    endpointUrls: string[],
    chainId: string,
  ): Promise<ValidatorClient[]> {
    return (await Promise.all(
      endpointUrls.map((endpointUrl) => ValidatorClient.connect(
        new ValidatorConfig(endpointUrl, chainId))
        .catch((_) => undefined),
      ),
    )).filter(isTruthy);
  }

  async findOptimalNode(endpointUrls: string[], chainId: string): Promise<string> {
    if (endpointUrls.length === 0) {
      const errorResponse = {
        error: {
          message: 'No nodes provided',
        },
      };
      return encodeJson(errorResponse);
    }
    const clients = await this.validatorClients(endpointUrls, chainId);
    const responses = (await Promise.all(
      clients
        .map(async (client) => {
          const block = await client.get.latestBlock();
          const response = new PingResponse(block);
          return {
            endpoint: client.config.restEndpoint,
            height: response.block.header.height,
            time: response.responseTime.getTime(),
          };
        })
        .map((promise) => promise.catch((_) => undefined)),
    )).filter(isTruthy);

    if (responses.length === 0) {
      throw new Error('Could not connect to endpoints');
    }
    const maxHeight = Math.max(...responses.map(({ height }) => height));
    return responses
    // Only consider nodes at `maxHeight`
      .filter(({ height }) => height === maxHeight)
    // Return the endpoint with the fastest response time
      .sort((a, b) => a.time - b.time)[0]
      .endpoint;
  }
}
