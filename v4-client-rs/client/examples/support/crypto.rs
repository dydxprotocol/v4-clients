//! Crypto provider initialization utilities for examples.
//!
//! This module provides a centralized way to initialize the rustls crypto provider
//! that is required for TLS connections in all examples that use NodeClient::connect().

use std::sync::Once;

static INIT_CRYPTO: Once = Once::new();

/// Initialize the rustls crypto provider.
///
/// This function must be called before any TLS operations (like NodeClient::connect()).
/// It's safe to call multiple times - the initialization will only happen once.
///
/// # Panics
///
/// Panics if the crypto provider fails to install.
pub fn init_crypto_provider() {
    INIT_CRYPTO.call_once(|| {
        rustls::crypto::ring::default_provider()
            .install_default()
            .expect("Failed to install default rustls crypto provider");
    });
}
