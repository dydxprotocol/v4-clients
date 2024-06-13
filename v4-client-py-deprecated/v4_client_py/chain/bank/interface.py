
"""Interface for the Bank functionality of CosmosSDK."""

from abc import ABC, abstractmethod

from v4_proto.cosmos.bank.v1beta1.query_pb2 import (
    QueryAllBalancesRequest,
    QueryAllBalancesResponse,
    QueryBalanceRequest,
    QueryBalanceResponse,
    QueryDenomMetadataRequest,
    QueryDenomMetadataResponse,
    QueryDenomsMetadataRequest,
    QueryDenomsMetadataResponse,
    QueryParamsRequest,
    QueryParamsResponse,
    QuerySupplyOfRequest,
    QuerySupplyOfResponse,
    QueryTotalSupplyRequest,
    QueryTotalSupplyResponse,
)


class Bank(ABC):
    """Bank abstract class."""

    @abstractmethod
    def Balance(self, request: QueryBalanceRequest) -> QueryBalanceResponse:
        """
        Query balance of selected denomination from specific account.

        :param request: QueryBalanceRequest with address and denomination

        :return: QueryBalanceResponse
        """

    @abstractmethod
    def AllBalances(self, request: QueryAllBalancesRequest) -> QueryAllBalancesResponse:
        """
        Query balance of all denominations from specific account.

        :param request: QueryAllBalancesRequest with account address

        :return: QueryAllBalancesResponse
        """

    @abstractmethod
    def TotalSupply(self, request: QueryTotalSupplyRequest) -> QueryTotalSupplyResponse:
        """
        Query total supply of all denominations.

        :param request: QueryTotalSupplyRequest

        :return: QueryTotalSupplyResponse
        """

    @abstractmethod
    def SupplyOf(self, request: QuerySupplyOfRequest) -> QuerySupplyOfResponse:
        """
        Query total supply of specific denomination.

        :param request: QuerySupplyOfRequest with denomination

        :return: QuerySupplyOfResponse
        """

    @abstractmethod
    def Params(self, request: QueryParamsRequest) -> QueryParamsResponse:
        """
        Query the parameters of bank module.

        :param request: QueryParamsRequest

        :return: QueryParamsResponse
        """

    @abstractmethod
    def DenomMetadata(
        self, request: QueryDenomMetadataRequest
    ) -> QueryDenomMetadataResponse:
        """
        Query the client metadata for all registered coin denominations.

        :param request: QueryDenomMetadataRequest with denomination

        :return: QueryDenomMetadataResponse
        """

    @abstractmethod
    def DenomsMetadata(
        self, request: QueryDenomsMetadataRequest
    ) -> QueryDenomsMetadataResponse:
        """
        Query the client metadata of a given coin denomination.

        :param request: QueryDenomsMetadataRequest

        :return: QueryDenomsMetadataResponse
        """
