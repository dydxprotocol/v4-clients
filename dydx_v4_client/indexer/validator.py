from dataclasses import dataclass
from typing import Self

import grpc
from v4_proto.cosmos.bank.v1beta1 import query_pb2 as bank_query
from v4_proto.cosmos.bank.v1beta1 import query_pb2_grpc as bank_query_grpc

from dydx_v4_client.indexer.network import Network


@dataclass
class ValidatorClient:
    network: Network
    channel: grpc.Channel

    @staticmethod
    async def connect(network: Network) -> Self:
        return ValidatorClient(
            network,
            grpc.secure_channel(network.validator, grpc.ssl_channel_credentials()),
        )

    async def get_account_balances(
        self, address: str
    ) -> bank_query.QueryAllBalancesResponse:
        stub = bank_query_grpc.QueryStub(self.channel)
        return stub.AllBalances(bank_query.QueryAllBalancesRequest(address=address))
