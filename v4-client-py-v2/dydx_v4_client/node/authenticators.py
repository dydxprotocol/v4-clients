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
            [sa.encode() for sa in sub_authenticators],
            separators=(",", ":"),
        )

        return Authenticator(
            auth_type,
            composed_config.encode(),
        )

    def encode(self):
        """Prepare object for composition."""
        dicls = asdict(self)
        dicls["config"] = list(dicls["config"])
        return dicls
