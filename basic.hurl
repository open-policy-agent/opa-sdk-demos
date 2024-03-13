GET http://127.0.0.1:3000/hello
Content-Type: application/json
HTTP 200
{"hello":"world"}

POST http://127.0.0.1:3000/auth/login
Content-Type: application/json
{"username": "john", "password": "changeme"}
HTTP 201
[Captures]
access_token: jsonpath "$['access_token']"

GET http://127.0.0.1:3000/profile
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
{"id":1,"username":"john"}

GET http://127.0.0.1:3000/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
[]

POST http://127.0.0.1:3000/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
{"name": "garfield", "age": 5, "breed": "unknown"}
HTTP 403

# Try as admin (maria)
POST http://127.0.0.1:3000/auth/login
Content-Type: application/json
{"username": "maria", "password": "guess"}
HTTP 201
[Captures]
access_token: jsonpath "$['access_token']"

POST http://127.0.0.1:3000/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
{"name": "garfield", "age": 5, "breed": "unknown"}
HTTP 201

GET http://127.0.0.1:3000/cats
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
[{"name":"garfield","age":5,"breed":"unknown"}]

GET http://127.0.0.1:3000/cats/garfield
Content-Type: application/json
Authorization: Bearer {{access_token}}
HTTP 200
{"name":"garfield","age":5,"breed":"unknown"}
