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

"""Implementation of Tx interface using REST."""

import base64
import json
from typing import Any, Dict, List

from google.protobuf.json_format import Parse, ParseDict

from v4_proto.cosmos.crypto.secp256k1.keys_pb2 import (  # noqa: F401  # pylint: disable=unused-import
    PubKey as ProtoPubKey,
)
from v4_proto.cosmos.tx.v1beta1.service_pb2 import (
    BroadcastTxRequest,
    BroadcastTxResponse,
    GetTxRequest,
    GetTxResponse,
    GetTxsEventRequest,
    GetTxsEventResponse,
    SimulateRequest,
    SimulateResponse,
)

from .interface import TxInterface
from ..common.rest_client import RestClient

# Unused imports are required to make sure that related types get generated - Parse and ParseDict fail without them


class TxRestClient(TxInterface):
    """Tx REST client."""

    API_URL = "/cosmos/tx/v1beta1"

    def __init__(self, rest_client: RestClient) -> None:
        """
        Create a Tx rest client.

        :param rest_client: RestClient api
        """
        self.rest_client = rest_client

    def Simulate(self, request: SimulateRequest) -> SimulateResponse:
        """
        Simulate executing a transaction to estimate gas usage.

        :param request: SimulateRequest
        :return: SimulateResponse
        """
        response = self.rest_client.post(
            f"{self.API_URL}/simulate",
            request,
        )
        return Parse(response, SimulateResponse())

    def GetTx(self, request: GetTxRequest) -> GetTxResponse:
        """
        GetTx fetches a tx by hash.

        :param request: GetTxRequest
        :return: GetTxResponse
        """
        response = self.rest_client.get(f"{self.API_URL}/txs/{request.hash}")

        # JSON in case of CosmWasm messages workaround
        dict_response = json.loads(response)
        self._fix_messages(dict_response["tx"]["body"]["messages"])
        self._fix_messages(dict_response["tx_response"]["tx"]["body"]["messages"])

        return ParseDict(dict_response, GetTxResponse())

    def BroadcastTx(self, request: BroadcastTxRequest) -> BroadcastTxResponse:
        """
        BroadcastTx broadcast transaction.

        :param request: BroadcastTxRequest
        :return: BroadcastTxResponse
        """
        response = self.rest_client.post(f"{self.API_URL}/txs", request)
        return Parse(response, BroadcastTxResponse())

    def GetTxsEvent(self, request: GetTxsEventRequest) -> GetTxsEventResponse:
        """
        GetTxsEvent fetches txs by event.

        :param request: GetTxsEventRequest
        :return: GetTxsEventResponse
        """
        response = self.rest_client.get(f"{self.API_URL}/txs", request)

        # JSON in case of CosmWasm messages workaround
        dict_response = json.loads(response)
        for tx in dict_response["txs"]:
            self._fix_messages(tx["body"]["messages"])

        for tx_response in dict_response["tx_responses"]:
            self._fix_messages(tx_response["tx"]["body"]["messages"])

        return ParseDict(dict_response, GetTxsEventResponse())
