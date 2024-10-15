# Rust client for dYdX v4

The crate implements interaction with the dYdX API.

The following features are implemented:
- `NodeClient`, `IndexerClient` + WebSockets, `FaucetClient`, `NobleClient`
- Fully asynchronous implementation
- Telemetry
- Convenient builder for constructing requests
- Automatic WS connection support

## Install

To add the crate to your project, use the command:

```sh
cargo add dydx-v4-rust
```

## Development

Workspace consists of a single crate:
* `client` - to provide connection management with dYdX, common types and utils

### Prerequisites

* [Rust](https://www.rust-lang.org/tools/install)
* [cargo deny](https://github.com/EmbarkStudios/cargo-deny)
* [protoc](https://grpc.io/docs/protoc-installation/) for dev dependencies (`metrics-exporter-tcp`)


### Examples

To run the example, you need to use the `cargo` command as follows:

```sh
cargo run --example bot_basic_adder
```

You can find the full set of examples in the [examples](client/examples) folder.

### Code quality assurance

Before publishing make sure to run (and fix all warnings and errors)

```sh
cargo fmt
cargo clippy
cargo deny check licenses advisories sources
```

### Documentation

To generate the documentation, use the command

```sh
cargo doc -p dydx-v4-rust
```

## Acknowledgements

Built by Nethermind: [@v0-e](https://github.com/v0-e), [@therustmonk](https://github.com/therustmonk),  [@maksimryndin](https://github.com/maksimryndin)

For more details about the grant see [link](https://www.dydxgrants.com/grants/rust-trading-client).
