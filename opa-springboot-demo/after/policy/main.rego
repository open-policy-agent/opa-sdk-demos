package demo

import rego.v1

roles := {
	"acmecorp": {
		"alice": ["admin"],
		"bob": ["writer"],
		"eve": ["reader"],
		"alfred": ["writer", "reader", "accounting"],
	},
	"globex": {
		"alice": ["writer"],
		"bob": ["reader"],
		"janet": ["writer", "reader"],
		"bill": ["writer", "reader", "legal"],
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

# Determine what role(s) would be required to perform the specified action.
roles_for_action contains r if {
	action == "read"
	r := "reader"
}

roles_for_action contains r if {
	action == "write"
	r := "writer"
}

roles_for_action contains r if {
	# Allow the application to use context data injection to signal
	# that extra roles are required.

	r := input.context.data["extra-roles"][_]
}

# Determine what roles the user is missing that are required for the action.
missing_roles contains r if {
	r := roles_for_action[_]
	not r in roles_for_user
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
	# This would be caught by our default deny case anyway, but we want to
	# generate a more helpful reason_admin if the user is missing a role.

	count(missing_roles) > 0

	dec := {
		"decision": false,
		"context": {
			"id": "missing-roles",
			"reason_admin": {"en": sprintf("access denied due to missing roles %s", [concat(", ", missing_roles)])},
		},
	}

} else := dec if {
	# If the user is not an admin, then to perform an action, they may not
	# be missing any required roles.

	count(missing_roles) == 0

	dec := {
		"decision": true,
		"context": {
			"id": "granted-by-role",
			"reason_admin": {"en": sprintf("access granted due to roles %s", [concat(", ", roles_for_action)])},
		},
	}
}
