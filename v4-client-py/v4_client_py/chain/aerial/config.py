"""Network configurations."""

import warnings
from dataclasses import dataclass
from typing import Optional, Union

from v4_client_py.clients.constants import (
    AERIAL_CONFIG_CHAIN_ID_TESTNET,
    AERIAL_CONFIG_URL_TESTNET,
    AERIAL_CONFIG_CHAIN_ID_MAINNET,
    AERIAL_CONFIG_URL_MAINNET,
    GRPC_OR_REST_MAINNET,
    GRPC_OR_REST_TESTNET,
)


class NetworkConfigError(RuntimeError):
    """Network config error.

    :param RuntimeError: Runtime error
    """


URL_PREFIXES = (
    "grpc+https",
    "grpc+http",
    "rest+https",
    "rest+http",
)


@dataclass
class NetworkConfig:
    """Network configurations.

    :raises NetworkConfigError: Network config error
    :raises RuntimeError: Runtime error
    """

    chain_id: str
    fee_minimum_gas_price: Union[int, float]
    fee_denomination: str
    staking_denomination: str
    url: str
    faucet_url: Optional[str] = None

    def validate(self):
        """Validate the network configuration.

        :raises NetworkConfigError: Network config error
        """
        if self.chain_id == "":
            raise NetworkConfigError("Chain id must be set")
        if self.url == "":
            raise NetworkConfigError("URL must be set")
        if not any(
            map(
                lambda x: self.url.startswith(x),  # noqa: # pylint: disable=unnecessary-lambda
                URL_PREFIXES,
            )
        ):
            prefix_list = ", ".join(map(lambda x: f'"{x}"', URL_PREFIXES))
            raise NetworkConfigError(f"URL must start with one of the following prefixes: {prefix_list}")

    @classmethod
    def fetchai_dorado_testnet(cls) -> "NetworkConfig":
        """Fetchai dorado testnet.

        :return: Network configuration
        """
        return NetworkConfig(
            chain_id="dorado-1",
            url="grpc+https://grpc-dorado.fetch.ai",
            fee_minimum_gas_price=5000000000,
            fee_denomination="atestfet",
            staking_denomination="atestfet",
            faucet_url="https://faucet-dorado.fetch.ai",
        )

    @classmethod
    def fetch_dydx_testnet(cls) -> "NetworkConfig":
        """Dydx testnet.

        :return: Network configuration
        """
        return NetworkConfig(
            chain_id=AERIAL_CONFIG_CHAIN_ID_TESTNET,
            url=f"{GRPC_OR_REST_TESTNET}+{AERIAL_CONFIG_URL_TESTNET}",
            fee_minimum_gas_price=4630550000000000,
            fee_denomination="adv4tnt",
            staking_denomination="dv4tnt",
            faucet_url="http://faucet.v4testnet.dydx.exchange",
        )

    @classmethod
    def fetchai_alpha_testnet(cls):
        """Get the fetchai alpha testnet.

        :raises RuntimeError: No alpha testnet available
        """
        raise RuntimeError("No alpha testnet available")

    @classmethod
    def fetchai_beta_testnet(cls):
        """Get the Fetchai beta testnet.

        :raises RuntimeError: No beta testnet available
        """
        raise RuntimeError("No beta testnet available")

    @classmethod
    def fetch_dydx_stable_testnet(cls):
        """Get the dydx stable testnet.

        :return: dydx stable testnet.
        """
        return cls.fetch_dydx_testnet()

    @classmethod
    def fetchai_mainnet(cls) -> "NetworkConfig":
        """Get the fetchai mainnet configuration.

        :return: fetch mainnet configuration
        """
        return NetworkConfig(
            chain_id=AERIAL_CONFIG_CHAIN_ID_MAINNET,
            url=f"{GRPC_OR_REST_MAINNET}+{AERIAL_CONFIG_URL_MAINNET}",
            fee_minimum_gas_price=0,
            fee_denomination="afet",
            staking_denomination="afet",
            faucet_url=None,
        )

    @classmethod
    def fetch_mainnet(cls) -> "NetworkConfig":
        """Get the fetch mainnet.

        :return: fetch mainnet configurations
        """
        warnings.warn(
            "fetch_mainnet is deprecated, use fetchai_mainnet instead",
            DeprecationWarning,
        )
        return cls.fetchai_mainnet()

    @classmethod
    def latest_stable_testnet(cls) -> "NetworkConfig":
        """Get the latest stable testnet.

        :return: latest stable testnet
        """
        warnings.warn(
            "latest_stable_testnet is deprecated, use fetch_dydx_stable_testnet instead",
            DeprecationWarning,
        )
        return cls.fetch_dydx_stable_testnet()
