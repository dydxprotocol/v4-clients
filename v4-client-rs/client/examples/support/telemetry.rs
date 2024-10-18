use anyhow::{anyhow as err, Result};
use metrics_exporter_tcp::Error;
use std::io::ErrorKind;

/// Setup telemetry
pub async fn metrics_dashboard() -> Result<()> {
    let default_port = 5000;
    let alt_port = 5049;
    // Try server on default port (5000) else try listen on 5049
    let port = match setup_server(default_port) {
        Ok(()) => default_port,
        Err(e) => match e {
            Error::Io(e) => {
                if matches!(e.kind(), ErrorKind::AddrInUse) {
                    setup_server(alt_port)
                        .map_err(|e| err!("Unable to setup telemetry server on port {default_port} or {alt_port}: {e}"))?;
                    alt_port
                } else {
                    return Err(e.into());
                }
            }
            _ => return Err(e.into()),
        },
    };

    tracing::info!("== THIS EXAMPLE USES `https://github.com/metrics-rs/metrics/tree/main/metrics-observer` AS A METRICS EXPORTER (on TCP port {port}) ==");

    Ok(())
}

fn setup_server(port: u16) -> Result<(), Error> {
    let addr: std::net::SocketAddr = format!("0.0.0.0:{port}")
        .parse()
        .expect("Failed parsing SocketAddr");
    let builder = metrics_exporter_tcp::TcpBuilder::new().listen_address(addr);
    builder.install()
}
