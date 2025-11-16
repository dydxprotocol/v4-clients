from dataclasses import dataclass
from typing import List, Optional

from dydx_v4_client.wallet import Wallet


@dataclass
class SubaccountInfo:
    """
    Represents a subaccount with its associated wallet and authenticators.
    
    This class encapsulates the account address, subaccount number, signing wallet,
    and optional authenticators for permissioned key support.
    
    Attributes:
        address: The account address (can differ from signing wallet address for permissioned keys)
        subaccount_number: The subaccount number (default 0)
        signing_wallet: The wallet used for signing transactions
        authenticators: Optional list of authenticator IDs for permissioned keys
    """
    address: str
    subaccount_number: int
    signing_wallet: Wallet
    authenticators: Optional[List[int]] = None

    @staticmethod
    def for_wallet(wallet: Wallet, subaccount_number: int = 0) -> "SubaccountInfo":
        """
        Create a SubaccountInfo for a regular wallet (non-permissioned).
        
        Args:
            wallet: The wallet to use for signing
            subaccount_number: The subaccount number (default 0)
            
        Returns:
            SubaccountInfo instance with address matching wallet address
        """
        return SubaccountInfo(
            address=wallet.address,
            subaccount_number=subaccount_number,
            signing_wallet=wallet,
        )

    @staticmethod
    def for_permissioned_wallet(
        signing_wallet: Wallet,
        account_address: str,
        subaccount_number: int = 0,
        authenticators: Optional[List[int]] = None,
    ) -> "SubaccountInfo":
        """
        Create a SubaccountInfo for a permissioned wallet.
        
        This is used when a different wallet signs transactions on behalf of another account.
        
        Args:
            signing_wallet: The wallet that will sign transactions
            account_address: The account address that owns the subaccount
            subaccount_number: The subaccount number (default 0)
            authenticators: List of authenticator IDs that authorize this wallet
            
        Returns:
            SubaccountInfo instance with address different from signing wallet address
        """
        return SubaccountInfo(
            address=account_address,
            subaccount_number=subaccount_number,
            signing_wallet=signing_wallet,
            authenticators=authenticators or [],
        )

    @property
    def is_permissioned_wallet(self) -> bool:
        """
        Check if this is a permissioned wallet (signing wallet differs from account address).
        
        Returns:
            True if address != signing_wallet.address, False otherwise
        """
        return self.address != self.signing_wallet.address

    def clone_with_subaccount(self, subaccount_number: int) -> "SubaccountInfo":
        """
        Create a copy of this SubaccountInfo with a different subaccount number.
        
        Args:
            subaccount_number: The new subaccount number
            
        Returns:
            New SubaccountInfo instance with updated subaccount number
        """
        return SubaccountInfo(
            address=self.address,
            subaccount_number=subaccount_number,
            signing_wallet=self.signing_wallet,
            authenticators=self.authenticators,
        )

