# `@open-policy-agent/opa-react` Demos

This React application showcases the request batching feature of `@open-policy-agent/opa-react` when used with the [EOPA Batch API](https://github.com/open-policy-agent/eopa/tree/main/openapi).

## How to use

### Docker

1. Run `docker compose up`
1. Go to <http://127.0.0.1:4000>

### Binaries

1. [Download EOPA](https://github.com/open-policy-agent/eopa/releases)
1. Start EOPA with the `policies` loaded: `eopa run --log-level debug --server policies/`
1. Start the app: `npm install && npm run start`
1. Go to <http://127.0.0.1:3000>

## Note on using OPA

You can use the demo app with Open Policy Agent, however batching mode will not work.
