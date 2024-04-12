
"""Interface for the Auth functionality of CosmosSDK."""

from abc import ABC, abstractmethod

from v4_proto.cosmos.auth.v1beta1.query_pb2 import (
    QueryAccountRequest,
    QueryAccountResponse,
    QueryParamsRequest,
    QueryParamsResponse,
)


class Auth(ABC):
    """Auth abstract class."""

    @abstractmethod
    def Account(self, request: QueryAccountRequest) -> QueryAccountResponse:
        """
        Query account data - sequence, account_id, etc.

        :param request: QueryAccountRequest that contains account address

        :return: QueryAccountResponse
        """

    @abstractmethod
    def Params(self, request: QueryParamsRequest) -> QueryParamsResponse:
        """
        Query all parameters.

        :param request: QueryParamsRequest

        :return: QueryParamsResponse
        """
