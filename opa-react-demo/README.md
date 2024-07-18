# `@styra/opa-react` Demos

This React application showcases the request batching feature of `@styra/opa-react` when used with the [Enterprise OPA Batch API](https://docs.styra.com/enterprise-opa/reference/api-reference/batch-api).

## How to use

### Docker

1. Set `$EOPA_LICENSE_KEY`
1. Run `docker compose up`
1. Go to <http://127.0.0.1:4000>

### Binaries

1. [Download Enterprise OPA](https://docs.styra.com/enterprise-opa/how-to/install/local)
1. Set `$EOPA_LICENSE_KEY` or sign up for a trial by running `eopa license trial`
1. Start Enterprise OPA with the `policies` loaded: `eopa run --log-level debug --server policies/`
1. Start the app: `npm install && npm run start`
1. Go to <http://127.0.0.1:3000>

## Note on using OPA

You can use the demo app with the open source Open Policy Agent, however batching mode will not work.
