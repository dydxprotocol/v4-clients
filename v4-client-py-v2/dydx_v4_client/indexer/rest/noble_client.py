import hashlib
from typing import List, Optional
import grpc
from bech32 import convertbits, bech32_encode
from google.protobuf.any_pb2 import Any
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.bank.v1beta1 import tx_pb2 as bank_tx
from v4_proto.cosmos.bank.v1beta1 import query_pb2_grpc as bank_query_grpc
from v4_proto.cosmos.base.v1beta1.coin_pb2 import Coin
from v4_proto.cosmos.tx.v1beta1 import service_pb2_grpc
from v4_proto.cosmos.tx.v1beta1.service_pb2 import SimulateRequest, BroadcastTxRequest, BroadcastMode
from v4_proto.cosmos.tx.v1beta1.tx_pb2 import Tx, TxBody, AuthInfo, Fee
from dydx_v4_client.wallet import from_mnemonic, Wallet


class NobleClient:
    """
    A client for interacting with the Noble blockchain.
    """

    def __init__(self, rest_endpoint: str, default_client_memo: Optional[str] = None):
        """
        Initializes a new instance of the NobleClient.

        Args:
            rest_endpoint (str): The REST endpoint URL for the Noble blockchain.
            default_client_memo (Optional[str]): The default client memo for transactions.
        """
        self.rest_endpoint = rest_endpoint
        self.default_client_memo = default_client_memo
        self.wallet = None
        self.channel = None

    @property
    def is_connected(self) -> bool:
        """
        Checks if the client is connected to the Noble blockchain.

        Returns:
            bool: True if connected, False otherwise.
        """
        return self.channel is not None

    async def connect(self, mnemonic: str):
        """
        Connects the client to the Noble blockchain using the provided mnemonic.

        Args:
            mnemonic (str): The mnemonic phrase for the wallet.

        Raises:
            ValueError: If the mnemonic is not provided.
        """
        if not mnemonic:
            raise ValueError("Mnemonic not provided")
        private_key = from_mnemonic(mnemonic)
        self.wallet = Wallet(private_key, 0, 0)
        self.channel = grpc.secure_channel(
            self.rest_endpoint,
            grpc.ssl_channel_credentials(),
        )

    async def get_account_balances(self) -> List[Coin]:
        """
        Retrieves the account balances for the connected wallet.

        Returns:
            List[Coin]: A list of Coin objects representing the account balances.

        Raises:
            ValueError: If the client is not connected.
        """
        if not self.is_connected:
            raise ValueError("Client is not connected")

        address = self.wallet.address
        stub = bank_query_grpc.QueryStub(self.channel)
        request = bank_query.QueryAllBalancesRequest(address=address)
        response = stub.AllBalances(request)
        return response.balances

    async def simulate_transfer_native_token(self, amount: str, recipient: str) -> Fee:
        """
        Simulates a transfer of native tokens.

        Args:
            amount (str): The amount of tokens to transfer.
            recipient (str): The recipient's address.

        Returns:
            Fee: The estimated fee for the transaction.

        Raises:
            ValueError: If the client is not connected.
        """
        if not self.is_connected:
            raise ValueError("Client is not connected")

        # Create a MsgSend transaction
        msg_send = bank_tx.MsgSend(
            from_address=self.wallet.address,
            to_address=recipient,
            amount=[Coin(amount=amount, denom="uusdc")]
        )
        any_msg = Any()
        any_msg.Pack(msg_send)

        tx_body = TxBody(messages=[any_msg])
        auth_info = AuthInfo()
        tx = Tx(body=tx_body, auth_info=auth_info)

        stub = service_pb2_grpc.ServiceStub(self.channel)
        simulate_request = SimulateRequest(tx=tx)
        simulate_response = stub.Simulate(simulate_request)

        return Fee(amount=simulate_response.gas_info.fee.amount, gas_limit=simulate_response.gas_info.gas_used)


    async def transfer_native(self, amount: str, recipient: str) -> str:
        """
        Transfers native tokens to the specified recipient.

        Args:
            amount (str): The amount of tokens to transfer.
            recipient (str): The recipient's address.

        Returns:
            str: The transaction hash.

        Raises:
            ValueError: If the client is not connected.
        """
        if not self.is_connected:
            raise ValueError("Client is not connected")

        # Create a MsgSend transaction
        msg_send = bank_tx.MsgSend(
            from_address=self.wallet.address,
            to_address=recipient,
            amount=[Coin(amount=amount, denom="uusdc")]
        )
        any_msg = Any()
        any_msg.Pack(msg_send)


        tx_body = TxBody(messages=[any_msg], memo=self.default_client_memo)
        fee = await self.simulate_transfer_native_token(amount, recipient)

        auth_info = AuthInfo(fee=fee)
        tx = Tx(body=tx_body, auth_info=auth_info)
        signed_tx = self.wallet.sign_tx(tx)

        stub = service_pb2_grpc.ServiceStub(self.channel)
        broadcast_request = BroadcastTxRequest(tx_bytes=signed_tx.SerializeToString(), mode=BroadcastMode.BROADCAST_MODE_BLOCK)
        broadcast_response = stub.BroadcastTx(broadcast_request)

        return broadcast_response.tx_response.txhash
