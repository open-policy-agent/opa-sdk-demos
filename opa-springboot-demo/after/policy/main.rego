package demo

import rego.v1

roles := {
	"acmecorp": {
		"alice": ["admin"],
		"bob": ["writer"],
		"eve": ["reader"],
	},
	"globex": {
		"alice": ["writer"],
		"bob": ["reader"],
	},
}

# A "real" Spring application would probably be using the input.subject field,
# which is based on Springs built-in authN framework. We have to determine the
# user and tenant from the headers due to the simplified way we implemented
# authN.
user := input.action.headers["demo-user"]

tenant := input.action.headers["demo-tenant"]

# Map HTTP verbs onto semantic actions in our policy.
action := a if {
	input.action.name == "GET"
	a := "read"
}

action := a if {
	input.action.name == "PUT"
	a := "write"
}

action := a if {
	input.action.name == "DELETE"
	a := "write"
}

# Detect if an unknown user or tenant is provided.
invalid_user_tenant if {
	not roles[tenant][user]
}

invalid_user_tenant if {
	not roles[tenant]
}

invalid_user_tenant if {
	not tenant
}

invalid_user_tenant if {
	not user
}

# Determine the roles assigned to the user.
roles_for_user := roles[tenant][user]

# Determine what role would be required to perform the specified action.
role_for_action := r if {
	action == "read"
	r := "reader"
}

role_for_action := r if {
	action == "write"
	r := "writer"
}

# Default-deny.
default main := {
	"decision": false,
	"context": {
		"id": "default",
		"reason_admin": {"en": "default deny"},
	},
}

main := dec if {
	# If the user or tenant is invalid, the request should be bounced, and the
	# variables we would otherwise use for our decision may be undefined.

	invalid_user_tenant
	dec := {
		"decision": false,
		"context": {
			"id": "invalid-user-tenant",
			"reason_user": {"en": "unrecognized user or tenant"},
		},
	}

} else := dec if {
	# Administrator override.

	"admin" in roles_for_user
	dec := {
		"decision": true,
		"context": {
			"id": "admin-override",
			"reason_admin": {"en": "administrators may perform any action"},
		},
	}
} else := dec if {
	# If the user is not an admin, then to perform an action, they must have
	# the role that goes with that action.

	role_for_action in roles_for_user
	dec := {
		"decision": true,
		"context": {
			"id": "granted-by-role",
			"reason_admin": {"en": sprintf("access granted due to role %s", [role_for_action])},
		},
	}
}
