package cats
import rego.v1

roles := {
  "maria": "admin",
}

default allow := false
allow := allowed(input.user, input.action, input.resource)

allowed(user, _, _) if user, "admin" in roles
allowed(_, "get", _)
allowed(_, "list", _)
