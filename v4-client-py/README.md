<p align="center"><img src="https://dydx.exchange/flat.svg" width="256" /></p>

<div align="center">
  <a href='https://pypi.org/project/dydx-v4-python'>
    <img src='https://img.shields.io/pypi/v/dydx-v4-python.svg' alt='PyPI'/>
  </a>
  <a href='https://github.com/dydxprotocol/dydx-v4-python/blob/master/LICENSE'>
    <img src='https://img.shields.io/github/license/dydxprotocol/dydx-v4-python.svg' alt='License' />
  </a>
</div>
<br>

Python client for dYdX (v4 API).

The library is currently tested against Python versions 3.9, and 3.11.

## Installation (TODO: modify after release)

The `dydx-v4-python` package is available on [PyPI](https://pypi.org/project/dydx-v4-python). Install with `pip`:

```bash
pip install dydx-v4-python
```

## Getting Started

Sample code is located in examples folder

## Development Setup - VS Code

Install Microsoft Python extensions
Shift-Command-P: Create Python Environment
Select Venv
Select Python 3.9 as interpreter
Select requirements.txt as the dependencies to install

TODO: Add dydxpy to the requirements.txt

Install dydxpy
```
pip install -i https://test.pypi.org/simple/ dydxpy==<version>
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
