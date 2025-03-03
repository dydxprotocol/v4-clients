from enum import Enum
import json
from dataclasses import asdict, dataclass
from typing import List


class AuthenticatorType(str, Enum):
    AllOf = "AllOf"
    AnyOf = "AnyOf"
    SignatureVerification = "SignatureVerification"
    MessageFilter = "MessageFilter"
    SubaccountFilter = "SubaccountFilter"
    ClobPairIdFilter = "ClobPairIdFilter"


@dataclass
class Authenticator:
    type: AuthenticatorType
    config: bytes

    # helpers to create Authenticator instances
    @classmethod
    def signature_verification(cls, pub_key: bytes) -> "Authenticator":
        """Enables authentication via a specific key."""
        return Authenticator(
            AuthenticatorType.SignatureVerification,
            pub_key,
        )

    @classmethod
    def message_filter(cls, msg_type: str) -> "Authenticator":
        """Restricts authentication to certain message types."""
        return Authenticator(
            AuthenticatorType.MessageFilter,
            msg_type.encode(),
        )

    @classmethod
    def subaccount_filter(cls, subaccounts: List[int]) -> "Authenticator":
        """Restricts authentication to a specific subaccount."""
        config = ",".join(map(str, subaccounts))
        return Authenticator(
            AuthenticatorType.SubaccountFilter,
            config.encode(),
        )

    @classmethod
    def clob_pair_id_filter(cls, clob_pair_ids: List[int]) -> "Authenticator":
        """Restricts authentication to a specific clob pair id."""
        config = ",".join(map(str, clob_pair_ids))
        return Authenticator(
            AuthenticatorType.ClobPairIdFilter,
            config.encode(),
        )

    @classmethod
    def compose(
        cls, auth_type: AuthenticatorType, sub_authenticators: list["Authenticator"]
    ) -> "Authenticator":
        """Combines multiple sub-authenticators into a single one."""
        composed_config = json.dumps(
            [sa.todict() for sa in sub_authenticators],
            separators=(",", ":"),
        )
        return Authenticator(
            auth_type,
            composed_config.encode(),
        )

    def todict(self) -> dict:
        """Prepare object for composition."""
        dicls = asdict(self)
        dicls["config"] = list(dicls["config"])
        return dicls


def validate_authenticator(authenticator: Authenticator) -> bool:
    """Validate the authenticator."""
    if authenticator.config.startswith(b"["):
        decoded_config = json.loads(authenticator.config.decode())
    else:
        decoded_config = authenticator.config

    return check_authenticator(dict(type=authenticator.type, config=decoded_config))


def check_authenticator(auth: dict) -> bool:
    """
    Check if the authenticator is safe to use.
    Parameters:
    - auth is a decoded authenticator object.
    """
    if not is_authenticator_alike(auth):
        return False

    if auth["type"] == AuthenticatorType.SignatureVerification:
        # SignatureVerification authenticator is considered safe
        return True

    if not isinstance(auth["config"], list):
        return False

    if auth["type"] == AuthenticatorType.AnyOf:
        # ANY_OF is safe only if ALL sub-authenticators return true
        return all(check_authenticator(sub_auth) for sub_auth in auth["config"])

    if auth["type"] == AuthenticatorType.AllOf:
        # ALL_OF is safe if at least one sub-authenticator returns true
        return any(check_authenticator(sub_auth) for sub_auth in auth["config"])

    # If it's a base-case authenticator but not SignatureVerification, it's unsafe
    return False


def is_authenticator_alike(auth: dict) -> bool:
    return isinstance(auth, dict) and auth.get("type") and auth.get("config")
