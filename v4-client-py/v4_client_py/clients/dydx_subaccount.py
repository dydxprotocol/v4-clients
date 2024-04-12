
from v4_client_py.chain.aerial.wallet import LocalWallet
from v4_client_py.clients.constants import BECH32_PREFIX

class Subaccount:
    def __init__(
        self,
        wallet: LocalWallet,
        subaccount_number: int=0,
    ):
        self.wallet = wallet
        self.subaccount_number = subaccount_number

    @classmethod
    def random(cls):
        wallet = LocalWallet.generate(BECH32_PREFIX)
        return cls(wallet)

    @classmethod
    def from_mnemonic(cls, mnemonic: str):
        wallet = LocalWallet.from_mnemonic(mnemonic, BECH32_PREFIX)
        return cls(wallet)

    @property
    def address(self) -> str:
        return self.wallet.address().__str__()

    @property
    def account_number(self) -> int:
        # Only use account number 0 for now.
        return 0

