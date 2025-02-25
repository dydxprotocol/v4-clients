import { Authenticator, AuthenticatorType, Network } from '../../src';
import { CompositeClient } from '../../src/clients/composite-client'

describe('CompositeClient', () => {
  describe('validateAuthenticators', () => {
    const network = Network.staging();

    it('Validates top level AnyOf authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const auth: Authenticator = {
        type: AuthenticatorType.ANY_OF,
        config: [
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
        ],
      }
      expect(client.validateAuthenticator(auth)).toEqual(true);
    });

    it('Fails top level AnyOf authenticators with non-signature nested authenticator', async () => {
      const client = await CompositeClient.connect(network);
      const auth: Authenticator = {
        type: AuthenticatorType.ANY_OF,
        config: [
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
        ],
      }
      expect(client.validateAuthenticator(auth)).toEqual(false);
    });

    it('Validates top level AllOf authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const auth: Authenticator = {
        type: AuthenticatorType.ALL_OF,
        config: [
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
        ],
      }
      expect(client.validateAuthenticator(auth)).toEqual(true);
    });

    it('Fails top level AllOf authenticators, without signature verification', async () => {
      const client = await CompositeClient.connect(network);
      const auth: Authenticator = {
        type: AuthenticatorType.ALL_OF,
        config: [
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
        ],
      }
      expect(client.validateAuthenticator(auth)).toEqual(false);
    });

    it('Validates nested anyOf authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const nestedAnyOf =  {
        type: AuthenticatorType.ANY_OF,
        config: [
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
        ]
      }
      const signatureVerification = {
        type: AuthenticatorType.SIGNATURE_VERIFICATION,
        config: ""
      }

      const auth: Authenticator = {
        type: AuthenticatorType.ALL_OF,
        config: [signatureVerification, nestedAnyOf],
      };
      expect(client.validateAuthenticator(auth)).toEqual(true);
    });

    it('Validates nested allOf authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const nestedAllOf =  {
        type: AuthenticatorType.ALL_OF,
        config: [
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
        ]
      }
      const messageVerification = {
        type: AuthenticatorType.MESSAGE_FILTER,
        config: ""
      }

      const auth: Authenticator = {
        type: AuthenticatorType.ALL_OF,
        config: [messageVerification, nestedAllOf],
      };
      expect(client.validateAuthenticator(auth)).toEqual(true);
    });

    it('Fails nested anyOf signatureVerification authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const nestedAnyOf =  {
        type: AuthenticatorType.ANY_OF,
        config: [
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
        ]
      }
      const messageVerification = {
        type: AuthenticatorType.MESSAGE_FILTER,
        config: ""
      }

      const auth: Authenticator = {
        type: AuthenticatorType.ALL_OF,
        config: [messageVerification, nestedAnyOf],
      };
      expect(client.validateAuthenticator(auth)).toEqual(false);
    });

    it('Fails nested anyOf authenticators', async () => {
      const client = await CompositeClient.connect(network);
      const nestedAnyOf =  {
        type: AuthenticatorType.ANY_OF,
        config: [
          { type: AuthenticatorType.MESSAGE_FILTER, config: "" },
          { type: AuthenticatorType.SIGNATURE_VERIFICATION, config: "" },
        ]
      }
      const messageVerification = {
        type: AuthenticatorType.MESSAGE_FILTER,
        config: ""
      }

      const auth: Authenticator = {
        type: AuthenticatorType.ANY_OF,
        config: [messageVerification, nestedAnyOf],
      };
      expect(client.validateAuthenticator(auth)).toEqual(false);
    });
  });
});
