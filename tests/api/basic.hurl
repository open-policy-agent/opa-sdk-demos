GET http://{{host}}/hello
Content-Type: application/json
HTTP 200
{"hello":"world"}

POST http://{{host}}/auth/login
Content-Type: application/json
{"username": "john", "password": "changeme"}
HTTP 201
[Captures]
access_token: jsonpath "$['access_token']"

GET http://{{host}}/profile
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
{"id":1,"username":"john"}

GET http://{{host}}/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
[]

POST http://{{host}}/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
{"name": "garfield", "age": 5, "breed": "unknown"}
HTTP 403

# Try as admin (maria)
POST http://{{host}}/auth/login
Content-Type: application/json
{"username": "maria", "password": "guess"}
HTTP 201
[Captures]
access_token: jsonpath "$['access_token']"

POST http://{{host}}/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
{"name": "garfield", "age": 5, "breed": "unknown"}
HTTP 201

GET http://{{host}}/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
[{"name":"garfield","age":5,"breed":"unknown"}]

GET http://{{host}}/cats/garfield
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
{"name":"garfield","age":5,"breed":"unknown"}
