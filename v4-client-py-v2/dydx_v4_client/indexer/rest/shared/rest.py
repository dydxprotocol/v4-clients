from typing import Any, Dict, Optional

import httpx

from dydx_v4_client.indexer.rest.constants import DEFAULT_API_TIMEOUT
from dydx_v4_client.indexer.rest.utils.request_helpers import generate_query_path


class RestClient:
    def __init__(self, host: str, api_timeout: Optional[float] = None):
        if host.endswith("/"):
            self.host = host[:-1]
        else:
            self.host = host
        self.api_timeout = api_timeout or DEFAULT_API_TIMEOUT

    async def get(self, request_path: str, params: Dict = {}) -> Dict[str, Any]:
        url = f"{self.host}{generate_query_path(request_path, params)}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=self.api_timeout)
            response.raise_for_status()
            return response.json()

    async def post(
        self,
        request_path: str,
        params: Dict = {},
        body: Optional[Any] = None,
        headers: Dict = {},
    ) -> httpx.Response:
        url = f"{self.host}{generate_query_path(request_path, params)}"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url, json=body, headers=headers, timeout=self.api_timeout
            )
            response.raise_for_status()
            return response
