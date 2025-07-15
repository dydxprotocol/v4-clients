from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Optional

from v4_proto.dydxprotocol.vault import query_pb2_grpc as vault_query_grpc
from v4_proto.dydxprotocol.vault import query_pb2 as vault_query

from dydx_v4_client.node.message import deposit_to_megavault, withdraw_from_megavault
from dydx_v4_client.utility import convert_amount_to_quantums_vec, to_serializable_vec
from dydx_v4_client.wallet import Wallet
from dydx_v4_client.node.client import NodeClient
from v4_proto.dydxprotocol.vault.share_pb2 import NumShares


@dataclass
class MegaVault:

    def __init__(self, node_client: NodeClient):
        self.node_client = node_client

    async def deposit(
        self, wallet: Wallet, address: str, subaccount_number: int, amount: Decimal
    ) -> Any:
        """
        Deposit USDC into the MegaVault.

        Args:
            wallet (Wallet): The wallet
            address (str): Address to deposit
            subaccount_number (int): Subaccount number
            amount (Decimal): Amount to deposit

        Returns:
            Any: The deposit response
        """
        try:
            qunatums = convert_amount_to_quantums_vec(amount)
            msg = deposit_to_megavault(
                address=address, subaccount_number=subaccount_number, quantums=qunatums
            )
            return await self.node_client.send_message(wallet=wallet, message=msg)
        except Exception as e:
            print(f"Error: {e}")

    async def withdraw(
        self,
        wallet: Wallet,
        address: str,
        subaccount_number: int,
        min_amount: Decimal,
        shares: Optional[int],
    ) -> Any:
        """
        Withdraw shares from the MegaVault.
        The number of shares must be equal or greater to some specified minimum amount (in USDC-equivalent value).

        Args:
            wallet (Wallet): The wallet
            address (str): Address to withdraw
            subaccount_number (int): Subaccount number associated with the address
            min_amount (Decimal): Minimum amount to withdraw
            shares (Optional[int]): Total share amount to withdraw

        Returns:
            Any: The withdrawal response
        """

        try:
            min_amount_quantums = convert_amount_to_quantums_vec(amount=min_amount)
            shares_quantums = to_serializable_vec(0 if shares is None else shares)
            msg = withdraw_from_megavault(
                address=address,
                subaccount_number=subaccount_number,
                min_quantums=min_amount_quantums,
                num_shares=shares_quantums,
            )
            return await self.node_client.send_message(wallet=wallet, message=msg)
        except Exception as e:
            print(f"Error: {e}")

    async def get_owner_shares(
        self, address: str
    ) -> vault_query.QueryMegavaultOwnerSharesResponse:
        """
        Query the shares associated with an address

        Args:
            address (str): Address to fetch information about

        Returns:
            vault_query.QueryMegavaultOwnerSharesResponse: Fetch total shares of the address
        """
        return vault_query_grpc.QueryStub(
            self.node_client.channel
        ).MegavaultOwnerShares(
            vault_query.QueryMegavaultOwnerSharesRequest(address=address)
        )

    async def get_withdrawal_info(
        self, shares: int
    ) -> vault_query.QueryMegavaultWithdrawalInfoResponse:
        """
        Query the withdrawal information for a specified number of shares.

        Args:
            shares (int): Share to fetch information about

        Returns:
            Any: Withdrawal info
        """
        return vault_query_grpc.QueryStub(
            self.node_client.channel
        ).MegavaultWithdrawalInfo(
            vault_query.QueryMegavaultWithdrawalInfoRequest(
                shares_to_withdraw=NumShares(num_shares=to_serializable_vec(shares))
            )
        )
