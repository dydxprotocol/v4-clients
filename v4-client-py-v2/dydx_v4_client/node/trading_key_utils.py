"""
Helper utilities for creating and managing trading keys (permissioned keys).

These utilities provide convenience functions for creating standard trading key
authenticators that allow a wallet to place orders, cancel orders, and batch cancel
on behalf of another account.
"""

import base64
import hashlib
import json
from typing import Dict, List, Optional

import bech32
from bip_utils import Bip39SeedGenerator, Bip39WordsNum, Bip39MnemonicGenerator
from Crypto.Hash import RIPEMD160

from dydx_v4_client.key_pair import KeyPair
from dydx_v4_client.node.authenticators import Authenticator, AuthenticatorType
from dydx_v4_client.wallet import Wallet

# Message type URLs for trading operations
TYPE_URL_MSG_PLACE_ORDER = "/dydxprotocol.clob.MsgPlaceOrder"
TYPE_URL_MSG_CANCEL_ORDER = "/dydxprotocol.clob.MsgCancelOrder"
TYPE_URL_BATCH_CANCEL = "/dydxprotocol.clob.MsgBatchCancel"


def create_new_random_dydx_wallet() -> Dict[str, str]:
    """
    Generate a new random dYdX wallet for use as a trading key.

    Returns:
        Dictionary containing:
            - mnemonic: 12-word mnemonic phrase
            - private_key_hex: Hex string of the private key (with 0x prefix)
            - public_key: Base64-encoded public key
            - address: dYdX bech32 address
    """
    # Generate a 12-word mnemonic (128 bits of entropy)
    mnemonic = Bip39MnemonicGenerator().FromWordsNumber(Bip39WordsNum.WORDS_NUM_12)
    
    key_pair = KeyPair.from_mnemonic(str(mnemonic))
    wallet = Wallet(key_pair, 0, 0)
    
    # Get private key hex from the PrivateKey object
    private_key_bytes = key_pair.key.secret
    private_key_hex = f"0x{private_key_bytes.hex()}"
    public_key_b64 = base64.b64encode(key_pair.public_key_bytes).decode('utf-8')
    
    return {
        "mnemonic": str(mnemonic),
        "private_key_hex": private_key_hex,
        "public_key": public_key_b64,
        "address": wallet.address,
    }


def get_authorize_new_trading_key_arguments(
    generated_wallet_pub_key: str,
) -> Dict[str, any]:
    """
    Create authenticator arguments to authorize a wallet public key to trade on behalf of the user.
    
    This creates a standard trading key authenticator that allows:
    - Place order
    - Cancel order
    - Batch cancel
    - Only on subaccount 0
    
    Args:
        generated_wallet_pub_key: Base64-encoded public key of the trading wallet
        
    Returns:
        Dictionary with 'type' (AuthenticatorType) and 'data' (bytes) for use with add_authenticator
    """
    def wrap_and_encode64(s: str) -> str:
        return base64.b64encode(s.encode('utf-8')).decode('utf-8')
    
    # Decode the public key from base64 to bytes
    pub_key_bytes = base64.b64decode(generated_wallet_pub_key)
    
    # Create message filter sub-authenticators
    message_filter_sub_auth = [
        {
            "type": AuthenticatorType.MessageFilter,
            "config": wrap_and_encode64(TYPE_URL_MSG_PLACE_ORDER),
        },
        {
            "type": AuthenticatorType.MessageFilter,
            "config": wrap_and_encode64(TYPE_URL_MSG_CANCEL_ORDER),
        },
        {
            "type": AuthenticatorType.MessageFilter,
            "config": wrap_and_encode64(TYPE_URL_BATCH_CANCEL),
        },
    ]
    
    any_of_message_filter_config_b64 = wrap_and_encode64(json.dumps(message_filter_sub_auth))
    
    # Create the sub-authenticators
    sub_auth = [
        {
            "type": AuthenticatorType.SignatureVerification,
            "config": generated_wallet_pub_key,  # Keep as base64 string
        },
        {
            "type": AuthenticatorType.AnyOf,
            "config": any_of_message_filter_config_b64,
        },
        {
            "type": AuthenticatorType.SubaccountFilter,
            "config": wrap_and_encode64('0'),
        },
    ]
    
    json_string = json.dumps(sub_auth)
    encoded_data = json_string.encode('utf-8')
    top_level_type = AuthenticatorType.AllOf
    
    return {
        "type": top_level_type,
        "data": encoded_data,
    }


def get_authorized_trading_keys_metadata(
    account_authenticators: List[any],
) -> List[Dict[str, str]]:
    """
    Parse authorized trading keys from authenticators response.
    
    Extracts trading keys that match the format created by get_authorize_new_trading_key_arguments.
    
    Args:
        account_authenticators: List of authenticators from get_authenticators response
        
    Returns:
        List of dictionaries containing:
            - id: Authenticator ID as string
            - publicKey: Base64-encoded public key
            - address: dYdX bech32 address derived from public key
    """
    result = []
    
    for auth in account_authenticators:
        if not hasattr(auth, 'type') or auth.type != AuthenticatorType.AllOf:
            continue
            
        try:
            # Decode the config
            if isinstance(auth.config, bytes):
                parsed_config = json.loads(auth.config.decode('utf-8'))
            else:
                parsed_config = json.loads(auth.config)
            
            if not isinstance(parsed_config, list):
                continue
            
            # Find the signature verification authenticator
            public_key = None
            for sub_auth in parsed_config:
                if (isinstance(sub_auth, dict) and 
                    sub_auth.get("type") == AuthenticatorType.SignatureVerification):
                    public_key = sub_auth.get("config")
                    break
            
            if public_key is None or not isinstance(public_key, str):
                continue
            
            # Derive address from public key
            try:
                pub_key_bytes = base64.b64decode(public_key)
                sha256_hash = hashlib.sha256(pub_key_bytes).digest()
                ripemd160_hash = RIPEMD160.new(sha256_hash).digest()
                address = bech32.bech32_encode("dydx", bech32.convertbits(ripemd160_hash, 8, 5))
            except Exception:
                continue
            
            result.append({
                "id": str(auth.id),
                "publicKey": public_key,
                "address": address,
            })
        except (json.JSONDecodeError, AttributeError, KeyError):
            continue
    
    return result

