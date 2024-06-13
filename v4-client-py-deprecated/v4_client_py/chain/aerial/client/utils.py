
"""Helper functions."""

from datetime import timedelta
from typing import Any, Callable, List, Optional, Union
from v4_client_py.clients.constants import BroadcastMode

from v4_proto.cosmos.base.query.v1beta1.pagination_pb2 import PageRequest

from ..tx import SigningCfg
from ..tx_helpers import SubmittedTx

def prepare_and_broadcast_basic_transaction(
    client: "LedgerClient",  # type: ignore # noqa: F821
    tx: "Transaction",  # type: ignore # noqa: F821
    sender: "Wallet",  # type: ignore # noqa: F821
    account: Optional["Account"] = None,  # type: ignore # noqa: F821
    gas_limit: Optional[int] = None,
    memo: Optional[str] = None,
    broadcast_mode: BroadcastMode = None,
    fee: Optional[int] = None,
) -> SubmittedTx:
    """Prepare and broadcast basic transaction.

    :param client: Ledger client
    :param tx: The transaction
    :param sender: The transaction sender
    :param account: The account
    :param gas_limit: The gas limit
    :param memo: Transaction memo, defaults to None
    :param broadcast_mode: Broadcast mode, defaults to None
    :param fee: Transaction fee, defaults to 5000. Denomination is determined by the network config.

    :return: broadcast transaction
    """
    # query the account information for the sender
    if account is None:
        account = client.query_account(sender.address())
    if fee is None:
        fee = client.network_config.fee_minimum_gas_price
    if gas_limit is None:

        # we need to build up a representative transaction so that we can accurately simulate it
        tx.seal(
            SigningCfg.direct(sender.public_key(), account.sequence),
            fee="",
            gas_limit=0,
            memo=memo,
        )
        tx.sign(sender.signer(), client.network_config.chain_id, account.number)
        tx.complete()

        # simulate the gas and fee for the transaction
        gas_limit, _ = client.estimate_gas_and_fee_for_tx(tx)

    # finally, build the final transaction that will be executed with the correct gas and fee values
    tx.seal(
        SigningCfg.direct(sender.public_key(), account.sequence),
        fee=f"{fee}{client.network_config.fee_denomination}",
        gas_limit=gas_limit,
        memo=memo,
    )
    tx.sign(sender.signer(), client.network_config.chain_id, account.number)
    tx.complete()

    result = client.broadcast_tx(tx)
    if broadcast_mode == BroadcastMode.BroadcastTxCommit:
        client.wait_for_query_tx(result.tx_hash)

    return result


def ensure_timedelta(interval: Union[int, float, timedelta]) -> timedelta:
    """
    Return timedelta for interval.

    :param interval: timedelta or seconds in int or float

    :return: timedelta
    """
    return interval if isinstance(interval, timedelta) else timedelta(seconds=interval)


DEFAULT_PER_PAGE_LIMIT = None


def get_paginated(
    initial_request: Any,
    request_method: Callable,
    pages_limit: int = 0,
    per_page_limit: Optional[int] = DEFAULT_PER_PAGE_LIMIT,
) -> List[Any]:
    """
    Get pages for specific request.

    :param initial_request: request supports pagination
    :param request_method: function to perform request
    :param pages_limit: max number of pages to return. default - 0 unlimited
    :param per_page_limit: Optional int: amount of records per one page. default is None, determined by server

    :return: List of responses
    """
    pages: List[Any] = []
    pagination = PageRequest(limit=per_page_limit)

    while pagination and (len(pages) < pages_limit or pages_limit == 0):
        request = initial_request.__class__()
        request.CopyFrom(initial_request)
        request.pagination.CopyFrom(pagination)

        resp = request_method(request)

        pages.append(resp)

        pagination = None

        if resp.pagination.next_key:
            pagination = PageRequest(limit=per_page_limit, key=resp.pagination.next_key)
    return pages
