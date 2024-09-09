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

GET http://{{host}}/cats/garfield
Content-Type: application/json
Authorization: Bearer {{access_token}}
x-user: stephan
HTTP 200
{"name":"garfield","age":5,"breed":"unknown"}
