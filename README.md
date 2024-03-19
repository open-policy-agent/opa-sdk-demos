# opa-typescript NestJS example

## Description

Based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# default env variables, corresponding to http://127.0.0.1:8181/v1/data/cats/allow
cp example.env .env

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Start OPA with the example policies

```bash
opa run --server policies
```

## Run some HTTP calls

```bash
hurl basic.hurl
```

(`hurl` is https://hurl.dev)
