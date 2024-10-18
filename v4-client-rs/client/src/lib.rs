//! [dYdX](https://dydx.trade/) v4 asynchronous client.
//!
//! [dYdX v4 architecture](https://docs.dydx.exchange/concepts-architecture/architectural_overview)
//! introduces nodes and the indexer for read-write and read-only operations accordingly.
//! Multiple entrypoints to the system are reflected in the client interface to allow for a highly customized use.
//!
//! The client allows:
//! * manage orders and funds (via [`NodeClient`](crate::node::NodeClient))
//! * query the dYdX network (via [`NodeClient`](crate::node::NodeClient) and [`IndexerClient`](crate::indexer::IndexerClient))
//! * get testnet token funds (via [`FaucetClient`](crate::faucet::FaucetClient), gated by feature `faucet`, turned on by default)
//! * transfer funds between Noble and dYdX (via [`NobleClient`](crate::noble::NobleClient), gated by feature `noble`, turned on by default)
//!
//! ### Telemetry
//!
//! The feature `telemetry` is turned on by default and provides [`metrics`](https://github.com/metrics-rs/metrics/tree/main/metrics) collection in a vendor-agnostic way.
//! This allows to use any compatible [metrics exporter](https://github.com/metrics-rs/metrics?tab=readme-ov-file#project-layout).
//! To see what metrics are collected check the public constants of the module [`telemetry`].
//! Many provided examples (see below) use [`metrics-observer`](https://github.com/metrics-rs/metrics/tree/main/metrics-observer) as an example metrics exporter
//! allowing to track them in a separate terminal.
//!
//! ### Examples
//!
//! Explore many elaborated examples in [the
//! repository](https://github.com/dydxprotocol/v4-clients/tree/main/v4-client-rs/client/examples).
//! Note - to run examples you need [`protoc`](https://grpc.io/docs/protoc-installation/) as `metrics-exporter-tcp` uses it during the build.

#![deny(missing_docs)]

/// Client configuration.
pub mod config;
/// Testnet tokens.
///
/// Note that faucet is available under the compilation feature `faucet` (turned on by default).
#[cfg(feature = "faucet")]
pub mod faucet;
/// Indexer client.
pub mod indexer;
/// Noble client.
///
/// Note that Noble client is available under the compilation feature `noble` (turned on by default).
#[cfg(feature = "noble")]
pub mod noble;
/// Node client.
pub mod node;
/// Telemetry.
///
/// Note that telemetry is available under the compilation feature `telemetry` (turned on by default).
#[cfg(feature = "telemetry")]
pub mod telemetry;
