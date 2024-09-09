package cats

import rego.v1

roles := {"maria": "admin"}

default allow := false

allow := allowed(input.user, input.action, input.resource, roles)

allowed(user, _, _, roles) if user, "admin" in roles

allowed(_, "get", _, _)

allowed(_, "list", _, _)
