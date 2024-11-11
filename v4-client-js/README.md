<p align="center"><img src="https://dydx.exchange/icon.svg?" width="256" /></p>

<h1 align="center">dYdX Chain Client for Javascript</h1>

<div align="center">
  <a href='https://www.npmjs.com/package/@dydxprotocol/v4-client-js'>
    <img src='https://img.shields.io/npm/v/@dydxprotocol/v4-client-js.svg' alt='npm'/>
  </a>
  <a href='https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-js/LICENSE'>
    <img src='https://img.shields.io/badge/License-AGPL_v3-blue.svg' alt='License' />
  </a>
</div>

The v4-Client Typescript client is used for placing transactions and querying the dYdX chain.

## Development

`v4-client-js` uses node `v18` for development, see the .nvmrc file [here](https://github.com/dydxprotocol/v4-clients/blob/main/v4-client-js/.nvmrc).
You can use `nvm` to manage different versions of node.

```
nvm install
nvm use
nvm alias default $(nvm version) # optional
```

You can run the following commands to ensure that you are running the correct `node` and `npm` versions.

```
node -v # expected: v20.x.x (should match .nvmrc)
npm -v  # expected: 10.x.x
```

### 1. Clone or fork the V4 clients repo

```bash
git clone git@github.com:dydxprotocol/v4-clients.git
```

### 2. Go to one of the examples

- Go to `v4-client-js/examples`

```bash
cd v4-client-js/examples
```

These examples by default use a test account with `DYDX_TEST_MNEMONIC` from the TS client library under `v4-client-js/examples/constants`, but you can use any test address that you own.

### 3. Run the scripts with node

```bash
npm install
npm run build
```

You should now see a `/build/examples` dir generated with JS files. We will use node to run these scripts

- Open a terminal to run an example, e.g. account_endpoints.

```bash
node ../build/examples/composite_example.js

```

Everytime you change the TS code, you need to run `npm run build` again, before you execute using node.

## Single-JS for mobile apps

Mobile apps needs to load JS as a single JS file. To build, run

```
npm run webpack
```

The file is generated in **native**/**ios**/v4-native-client.js
Pending: Different configurations may be needed to generate JS for Android app

## Release

Using the `npm version` command will update the appropriate version tags within the package locks and also will add a git tag with the version number..
For example `npm version minor` will perform the necessary changes for a minor version release. After the change is merged, a GitHub action will
[publish](https://github.com/dydxprotocol/v4-clients/blob/master/.github/workflows/js-publish.yml) the new release.
