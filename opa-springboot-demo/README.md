# OPA Spring Boot SDK Demo

This is a simple demonstration application for the [OPA Spring Boot SDK](https://github.com/styrainc/opa-springboot). The application presents a simple REST based object store implemented using Spring Boot.

The [`before`](./before) folder contains a version of the demo app without any API authorization, and the [`after`](./after) folder shows the same application with API authorization added using the OPA Spring Boot SDK.

Both applications can be launched via `./gradlew run`. The "after" version expects to find OPA running on `http://localhost:8181`, which can be changed by setting the `OPA_URL` environment variable. A sample policy can be found in [`after/policy`](./after/policy). You can launch an OPA instance with this policy using `opa run -s --bundle ./after/policy`.

## Pre-Integration Sample Interaction

This shell session shows an example of interacting with the pre-integration version of the demo app using `curl`. You need to run `./gradlew run` in the `before` folder for this to work.

*Create sample objects. Since there is no authorization yet, we can set the tenant and user to arbitrary values, though the API will error if we omit them.*

```plain
$ curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" --data '{"foo": "bar"}' http://localhost:8080/object/obj1
$ curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" --data '{"bar": "baz"}' http://localhost:8080/object/obj2
$ curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: b" --data '{"spam": "ham"}' http://localhost:8080/object/obj3
```

*Check that the `b` tenant contains `obj3`, and the `a` tenant contains `obj1` and `obj2`.*

```plain
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: b" http://localhost:8080/object | jq
[
  "obj3"
]
curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object | jq
[
  "obj2",
  "obj1"
]
```

*Read the objects back out. Notice that if we try to read `obj3` from tenant `a`, we get a not found, since we created that object in the `b` tenant.*

```plain
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj1 | jq
{
  "foo": "bar"
}
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj2 | jq
{
  "bar": "baz"
}
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj3 | jq
{
  "timestamp": "2024-07-23T21:07:49.824+00:00",
  "status": 404,
  "error": "Not Found",
  "path": "/object/obj3"
}
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: b" http://localhost:8080/object/obj3 | jq
{
  "spam": "ham"
}
```

*Modify `obj1` in place and read the value back out, to ensure that the new value has actually been stored.*

```plain
$ curl -X PUT -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" --data '{"new": "val"}' http://localhost:8080/object/obj1
$ curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj1 | jq
{
  "new": "val"
}
```

*Delete `obj1` and ensure it is not found if we try to access it again.*

```plain
curl -LSs -X DELETE -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj1
curl -LSs -X GET -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: a" http://localhost:8080/object/obj1 | jq
{
  "timestamp": "2024-07-23T21:09:30.449+00:00",
  "status": 404,
  "error": "Not Found",
  "path": "/object/obj1"
}
```

## Post-Integration Sample Interaction

This shell session shows an example of interacting with the post-integration version of the demo app using `curl`. You need to run `opa run -s --bundle ./policy` in the `after` folder, then in a separate terminal run `./gradlew run` in the `after` folder for this to work. If you want to see the HTTP status codes from the API server, just add the `-v` argument to the curl commands.


*Since `alice` has the `admin` role in the `acmecorp` tenant, she should be able to perform any action. We demonstrate this by creating an object, verifying it shows up in the object list, deleting it, and finally verifying it is no longer present.*

```plain
$ curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" --data '{"foo": "bar"}' http://localhost:8080/object/obj1
$ curl -LSs -X GET -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" http://localhost:8080/object | jq
[
  "obj1"
]
$ curl -LSs -X DELETE -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" http://localhost:8080/object/obj1
$ curl -LSs -X GET -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" http://localhost:8080/object | jq
[]
```

`bob` should be able to make changes, but not read the content of the objects or list them due to only having the `writer` role. We verify this by having `bob` create an object. When `bob` tries to get the object listing or read `obj2`, it fails, but `alice` is still able to perform those actions.

```plain
$ curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: bob" -H "Demo-Tenant: acmecorp" --data '{"spam": "ham"}' http://localhost:8080/object/obj2
$ curl -LSs -X GET -H "Demo-User: bob" -H "Demo-Tenant: acmecorp" http://localhost:8080/object | jq
$ curl -LSs -X GET -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" http://localhost:8080/object | jq
[
  "obj2"
]
$ curl -LSs -X GET -H "Demo-User: bob" -H "Demo-Tenant: acmecorp" http://localhost:8080/object/obj2 | jq
$ curl -LSs -X GET -H "Demo-User: alice" -H "Demo-Tenant: acmecorp" http://localhost:8080/object/obj2 | jq
{
  "spam": "ham"
}
```

`eve` should be able to read objects, but not modify them due to only having the `reader` role. We check this by having `eve` read the existing `obj2` object, then try to create an `obj3` object and verifying that it does not exist after we did so.

```plain
curl -LSs -X GET -H "Demo-User: eve" -H "Demo-Tenant: acmecorp" http://localhost:8080/object/obj2 | jq
{
  "spam": "ham"
}
curl -LSs -X PUT -H "Content-Type: application/json" -H "Demo-User: eve" -H "Demo-Tenant: acmecorp" --data '{"bar": "baz"}' http://localhost:8080/object/obj3
curl -LSs -X GET -H "Demo-User: eve" -H "Demo-Tenant: acmecorp" http://localhost:8080/object/obj3 | jq
{
  "timestamp": "2024-07-24T19:36:58.088+00:00",
  "status": 404,
  "error": "Not Found",
  "path": "/object/obj3"
}
```
