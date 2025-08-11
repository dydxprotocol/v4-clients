from decimal import Decimal

import pytest

from dydx_v4_client.utility import (
    Usdc,
    to_serializable_vec,
    convert_amount_to_quantums_vec,
)


@pytest.mark.asyncio
async def test_usdc():
    init_value = Decimal(1.12345678)
    usdc = Usdc(init_value)
    quantize = usdc.quantize()
    assert abs(quantize - Decimal(1123456.78)) < 1e-6
    quantize_as_bigint = usdc.quantize_as_u64()
    assert quantize_as_bigint == 1123456
    usdc_from_decimal = Usdc.from_quantums(quantize)
    assert abs(init_value - usdc_from_decimal.value) < 1e-6
    usdc_from_bigint = Usdc.from_quantums(quantize_as_bigint)
    assert abs(init_value - usdc_from_bigint.value) < 1e-6


@pytest.mark.asyncio
async def test_to_serializable_vec():
    positive_value = to_serializable_vec(123456)
    negative_value = to_serializable_vec(-123456)
    assert positive_value[1:] == negative_value[1:]
    assert positive_value[0] == 2
    assert negative_value[0] == 3


@pytest.mark.asyncio
async def test_convert_amount_to_quantums_vec():
    positive_value = convert_amount_to_quantums_vec(123456)
    negative_value = convert_amount_to_quantums_vec(-123456)
    assert positive_value[1:] == negative_value[1:]
    assert positive_value[0] == 2
    assert negative_value[0] == 3

    # check exception case
    try:
        convert_amount_to_quantums_vec(None)
        assert 1 == 0
    except Exception as e:
        assert (
            "Failed converting amount to serializable quantums vector: conversion from NoneType to Decimal is not supported"
            in str(e)
        )
