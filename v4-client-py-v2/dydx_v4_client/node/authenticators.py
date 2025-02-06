__all__ = [
    "SubAuthenticator",
    "AuthenticatorType",
    "Authenticator",
    "composed_authenticator",
    "signature_verification",
    "message_filter",
    "subaccount_filter",
    "clob_pair_id_filter",
    "decode_authenticator",
]

import base64
import binascii
import json
from typing import Union

from typing_extensions import Literal, TypedDict


class SubAuthenticator(TypedDict):
    type: str
    config: str


AuthenticatorType = Literal["AllOf", "AnyOf"]


class Authenticator(TypedDict):
    type: AuthenticatorType
    config: list[SubAuthenticator]


def b64encode(value: bytes) -> str:
    """Encodes bytes into a base64 string."""
    return base64.b64encode(value).decode()


def b64decode(value: str) -> bytes:
    """Decodes a base64 string into bytes."""
    return base64.b64decode(value)


def decode_authenticator(config: str, auth_type: str) -> Union[SubAuthenticator, Authenticator]:
    """Decodes a sub-authenticator configuration."""
    if auth_type == "SignatureVerification":
        return {
            "type": auth_type,
            "config": b64decode(config),
        }
    elif auth_type == "MessageFilter":
        return {
            "type": auth_type,
            "config": b64decode(config).decode(),
        }
    elif auth_type == "SubaccountFilter":
        return {
            "type": auth_type,
            "config": int.from_bytes(b64decode(config)),
        }
    elif auth_type == "ClobPairIdFilter":
        return {
            "type": auth_type,
            "config": int.from_bytes(b64decode(config)),
        }
    elif auth_type in ["AllOf", "AnyOf"]:
        decoded_subs = []
        try:
            subauth_config = json.loads(b64decode(config))
        except (binascii.Error, UnicodeDecodeError):
            subauth_config = json.loads(config)
        for subauth in subauth_config:
            decoded_sub = decode_authenticator(subauth['config'], subauth['type'])
            decoded_subs.append(decoded_sub)
        return {
            "type": auth_type,
            "config": decoded_subs,
        }
    else:
        raise ValueError(f"Unknown SubAuthenticator type: {auth_type}")


def _prepare_authenticator(
    auth: Union[Authenticator, SubAuthenticator]
) -> SubAuthenticator:
    """ Converts Authenticator to SubAuthenticator to allow composition. """
    if isinstance(auth["config"], list):
        return {
            "type": auth["type"],
            "config": b64encode(json.dumps(auth["config"]).encode())
        }
    return auth


def composed_authenticator(
    authenticator_type: AuthenticatorType,
    sub_authenticators: list[Union[Authenticator, SubAuthenticator]],
) -> Authenticator:
    """Combines multiple sub-authenticators into a single one."""
    dumped_subs = [_prepare_authenticator(sa) for sa in sub_authenticators]
    return {
        "type": authenticator_type,
        "config": dumped_subs,
    }


def signature_verification(pub_key: bytes) -> SubAuthenticator:
    """Enables authentication via a specific key."""
    return {
        "type": "SignatureVerification",
        "config": b64encode(pub_key),
    }


def message_filter(msg_type: str) -> SubAuthenticator:
    """Restricts authentication to certain message types."""
    assert msg_type.startswith("/"), msg_type
    return {
        "type": "MessageFilter",
        "config": b64encode(msg_type.encode()),
    }


def subaccount_filter(subaccount_id: int) -> SubAuthenticator:
    """Restricts authentication to certain subaccount constraints."""
    return {
        "type": "SubaccountFilter",
        "config": b64encode(subaccount_id.to_bytes()),
    }


def clob_pair_id_filter(clob_pair_id: int) -> SubAuthenticator:
    """Restricts transactions to specific CLOB pair IDs."""
    return {
        "type": "ClobPairIdFilter",
        "config": b64encode(clob_pair_id.to_bytes()),
    }
