# opa-typescript NestJS example

## Description

Based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Input Payloads from Authz Decorators

### Static key/val pairs

Use the `Extra` decorator to add static information to the request payload sent to OPA:

```ts
@Extra(() => ({ resource: 'cat' }))
```

on either the _class_ or the _handler_ method will add

```json
{ "resource": "cat" }
```

to each request payload.

### Forward request body

```http
POST /cats
{"name": "garfield", "age": 5, "breed": "unknown"}
```

The entire request body can be forwarded:

```ts
@Extra(({ body }) => body)
```

```json
{
  "name": "garfield",
  "age": 5,
  "breed": "unknown"
}
```

Note that we can also add a static part to this:

```ts
@Extra(({ body }) => ({ ...body, action: 'create' }))
```

```json
{
  "name": "garfield",
  "age": 5,
  "breed": "unknown",
  "action": "create"
}
```

It's also possible to select just parts of the body:

```ts
@Extra(({ body: { name } }) => ({ name, action: 'create' }))
```

```json
{
  "name": "garfield",
  "action": "create"
}
```

If you want to put the body into some key on the payload, use

```ts
@Extra(({ body }) => ({ payload: body }))
```

```json
{
  "payload": {
    "name": "garfield",
    "age": 5,
    "breed": "unknown"
  }
}
```

Route parameters can also be injected:

```ts
@Get(':name')
@Extra(({ params }) => ({ ...params, action: 'get' }))
async findByName(@Param('name') name: string): Promise<Cat> {
  return this.catsService.findByName(name);
}
```

```json
{
  "name": "garfield",
  "action": "get"
}
```

### More Request Details

Under the hood, the `@Extra` decorator registers functions that (optionally) take a `Request` parameter.
See [the NestJS docs for all the fields that you can use](https://docs.nestjs.com/controllers#request-object).

Pass along the client IP via

```ts
@Extra(({ ip }) => ({ ip }))
```

Or one specific header,

```ts
@Extra(({ headers: { 'x-user': u } }) => ({
  ['x-user']: u,
}))
```

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
