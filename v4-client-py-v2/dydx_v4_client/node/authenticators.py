import base64
import binascii
import json
from dataclasses import dataclass
from typing import Literal, Union


AuthenticatorType = Literal["AllOf", "AnyOf"]


@dataclass
class SubAuthenticator:
    type: str
    config: Union[str, bytes, int]


@dataclass
class Authenticator:
    type: AuthenticatorType
    config: list[SubAuthenticator]


def b64encode(value: bytes) -> str:
    """Encodes bytes into a base64 string."""
    return base64.b64encode(value).decode()


def b64decode(value: str) -> bytes:
    """Decodes a base64 string into bytes."""
    return base64.b64decode(value)


def decode_authenticator(
    config: str, auth_type: str
) -> Union[SubAuthenticator, Authenticator]:
    """Decodes a sub-authenticator configuration."""
    if auth_type == "SignatureVerification":
        return SubAuthenticator(type=auth_type, config=b64decode(config))
    elif auth_type == "MessageFilter":
        return SubAuthenticator(type=auth_type, config=b64decode(config).decode())
    elif auth_type == "SubaccountFilter":
        return SubAuthenticator(
            type=auth_type, config=int.from_bytes(b64decode(config))
        )
    elif auth_type == "ClobPairIdFilter":
        return SubAuthenticator(
            type=auth_type, config=int.from_bytes(b64decode(config))
        )
    elif auth_type in ["AllOf", "AnyOf"]:
        decoded_subs: list[SubAuthenticator] = []
        try:
            # Try decoding assuming the config is base64 encoded JSON.
            subauth_config = json.loads(b64decode(config))
        except (binascii.Error, UnicodeDecodeError):
            subauth_config = json.loads(config)
        for subauth in subauth_config:
            # Each sub–authenticator is itself encoded as a dict.
            decoded_sub = decode_authenticator(subauth["config"], subauth["type"])
            # In our overall design, we want a list of SubAuthenticators.
            # If a composite authenticator was decoded, we “prepare” it for inclusion.
            if isinstance(decoded_sub, Authenticator):
                decoded_sub = _prepare_authenticator(decoded_sub)
            decoded_subs.append(decoded_sub)
        return Authenticator(
            type=auth_type, config=decoded_subs  # type: ignore[literal-required]
        )
    else:
        raise ValueError(f"Unknown SubAuthenticator type: {auth_type}")


def _prepare_authenticator(
    auth: Union[Authenticator, SubAuthenticator]
) -> SubAuthenticator:
    """
    Converts an Authenticator (with a list of sub–authenticators) into a SubAuthenticator.
    This is needed for composition so that all sub–authenticators have the same (flat)
    shape.
    """
    if isinstance(auth.config, list):
        # Convert the list of sub–authenticators into a JSON string.
        # (We convert each dataclass to a dict via __dict__ so that it is JSON serializable.)
        subs_as_dicts = [sa.__dict__ for sa in auth.config]
        encoded_config = b64encode(json.dumps(subs_as_dicts).encode())
        return SubAuthenticator(type=auth.type, config=encoded_config)
    return auth


def composed_authenticator(
    authenticator_type: AuthenticatorType,
    sub_authenticators: list[Union[Authenticator, SubAuthenticator]],
) -> Authenticator:
    """Combines multiple sub-authenticators into a single one."""
    dumped_subs = [_prepare_authenticator(sa) for sa in sub_authenticators]
    return Authenticator(type=authenticator_type, config=dumped_subs)


def signature_verification(pub_key: bytes) -> SubAuthenticator:
    """Enables authentication via a specific key."""
    return SubAuthenticator(type="SignatureVerification", config=b64encode(pub_key))


def message_filter(msg_type: str) -> SubAuthenticator:
    """Restricts authentication to certain message types."""
    assert msg_type.startswith("/"), msg_type
    return SubAuthenticator(type="MessageFilter", config=b64encode(msg_type.encode()))


def subaccount_filter(subaccount_id: int) -> SubAuthenticator:
    """Restricts authentication to certain subaccount constraints."""
    return SubAuthenticator(
        type="SubaccountFilter", config=b64encode(subaccount_id.to_bytes())
    )


def clob_pair_id_filter(clob_pair_id: int) -> SubAuthenticator:
    """Restricts transactions to specific CLOB pair IDs."""
    return SubAuthenticator(
        type="ClobPairIdFilter", config=b64encode(clob_pair_id.to_bytes())
    )
