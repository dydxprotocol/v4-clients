<p align="center"><img src="https://dydx.exchange/icon.svg?" width="256" /></p>

<h1 align="center">dYdX Chain Clients</h1>

<div align="center">
  <a href='https://www.npmjs.com/package/@dydxprotocol/v4-client-js'>
    <img src='https://img.shields.io/npm/v/@dydxprotocol/v4-client-js.svg' alt='npm'/>
  </a>
    <a href='https://pypi.org/project/dydx-v4-client'>
    <img src='https://img.shields.io/pypi/v/dydx-v4-client.svg' alt='PyPI'/>
  </a>
  <a href='https://github.com/dydxprotocol/v4-clients/blob/main/LICENSE'>
    <img src='https://img.shields.io/badge/License-AGPL_v3-blue.svg' alt='License' />
  </a>
</div>

## v4-client-js
The dYdX Chain Client Typescript client is used for placing transactions and querying the dYdX chain.

## v4-client-py-v2
Python client for dYdX Chain. Developed and maintained by the Nethermind team.
- [Saul M.](https://github.com/samtin0x)
- [Piotr P.](https://github.com/piwonskp)

## v4-client-rs
Rust client for dYdX Chain. Developed and maintained by the Nethermind team.
- [Emanuel V.](https://github.com/v0-e)
- [Denis K.](https://github.com/therustmonk)
- [Maksim R.](https://github.com/maksimryndin)

## v4-client-cpp (Third Party Client)
To pull the latest C++ client, run `git submodule update --init --recursive`

Please note the C++ client only works on Linux.

This client was originally developed and open-sourced through a grant by the dYdX Grants Trust — an
unaffiliated and independent third-party from dYdX Trading Inc.

The original client can be found [here](https://github.com/asnefedovv/dydx-v4-client-cpp).

## dydxjs
<b>dydxjs</b> is a Typescript library for interacting with dYdX chain and other Cosmos blockchains. It makes it easy to compose and broadcast dYdX and Cosmos messages, with all of the proto and amino encoding handled for you.<br/>
<i>Note: This library provides the low-level interfaces to compose and send transactions. It is recommended to install `v4-client-js` for a simpler developer experience.</i>

# Third-party Clients

By clicking the above links to third-party clients, you will leave the dYdX Trading Inc. (“dYdX”) GitHub repository and join repositories made available by third parties, which are independent from and unaffiliated with dYdX. dYdX is not responsible for any action taken or content on third-party repositories.

# Contributing

## We use [Conventional Commits](https://github.com/conventional-changelog/commitlint)
We use a commit-msg hook to check if your commit messages meet the conventional commit format.

In general the pattern looks like this:

`type(scope?): subject`  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")

### Real world examples can look like this:
`chore: run tests on travis ci`
`fix(server): send cors headers`
`feat(blog): add comment section`

Common types according to commitlint-config-conventional can be:

build
chore
ci
docs
feat
fix
perf
refactor
revert
style
test

## Any contributions you make will be under the same License
When you submit code changes, your submissions are understood to be under the same [License](https://github.com/dydxprotocol/v4-web/blob/master/LICENSE) that covers the project.
