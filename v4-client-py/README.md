<p align="center"><img src="https://dydx.exchange/icon.svg?" width="256" /></p>

<h1 align="center">v4 Client for Python</h1>

<div align="center">
  <a href='https://pypi.org/project/v4-client-py'>
    <img src='https://img.shields.io/pypi/v/v4-client-py.svg' alt='PyPI'/>
  </a>
  <a href='https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-py/LICENSE'>
    <img src='https://img.shields.io/badge/License-BSL_1.1-blue' alt='License' />
  </a>
</div>

Python client for dYdX (v4 API).

The library is currently tested against Python versions 3.9, and 3.11.

## Installation

The `v4-client-py` package is available on [PyPI](https://pypi.org/project/v4-client-py). Install with `pip`:

```bash
pip install v4-client-py
```

## Getting Started

Sample code is located in examples folder

## Development Setup - VS Code

Install Microsoft Python extensions
```
Shift-Command-P: Create Python Environment
Select Venv
Select Python 3.9 as interpreter
Select requirements.txt as the dependencies to install
```


Install requirements
```
pip install -r requirements.txt
```

VS Code will automatically switch to .venv environment when running example code. Or you can manually switch

```
source ~/<project_dir>/.venv/bin/activate
```

Set PYTHONPATH

```
export PYTHONPATH=~/<project_dir>/.venv/lib/<Python version>/site-packages
```

## Troubleshootimg

Cython and Brownie must be installed before cytoolz

If there is any issue with cytoolz, uninstall cytoolz, Brownie and Cython, reinstall Cython, Brownie and cytoolz sequentially.

VS Code may need to be restarted to have Cython functioning correctly


## Running examples

Select the file to be debugged
Select the debug button on the left
Select "Python: Current File" 

## Running tests

Integration tests uses Staging environment for testing. We use pytest.

To install pytest

```
pip install pytest
```

For read-only integration tests, run:

```
pytest -v
```

For integration tests with transactions, a subaccount must exist for the specified address.
This subaccount may be reset when staging environment is reset. To create the subaccount, run

examples/faucet_endpoint.py

Wait for a few seconds for the faucet transaction to commit, then run

```
pytest -v -c pytest_integration.ini 
```
