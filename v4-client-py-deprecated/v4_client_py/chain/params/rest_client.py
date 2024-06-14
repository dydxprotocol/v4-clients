# -*- coding: utf-8 -*-
# ------------------------------------------------------------------------------
#
#   Copyright 2023 dYdX Trading Inc
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# ------------------------------------------------------------------------------

"""Implementation of Params interface using REST."""

from google.protobuf.json_format import Parse

from v4_proto.cosmos.params.v1beta1.query_pb2 import (
    QueryParamsRequest,
    QueryParamsResponse,
)
from .interface import Params
from ..common.rest_client import RestClient


class ParamsRestClient(Params):
    """Params REST client."""

    API_URL = "/cosmos/params/v1beta1"

    def __init__(self, rest_api: RestClient) -> None:
        """
        Initialize.

        :param rest_api: RestClient api
        """
        self._rest_api = rest_api

    def Params(self, request: QueryParamsRequest) -> QueryParamsResponse:
        """
        Params queries a specific Cosmos SDK parameter.

        :param request: QueryParamsRequest
        :return: QueryParamsResponse
        """
        json_response = self._rest_api.get(f"{self.API_URL}/params", request)
        return Parse(json_response, QueryParamsResponse())
