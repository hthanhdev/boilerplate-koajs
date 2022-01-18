const camelCase = require("camelcase");

module.exports = async (
	ctx,
	next,
	action = "read",
	scope = "any",
	resource = ""
) => {
	const permission = global.rbac
		.can(ctx.state.user.roleId.toString())
	[camelCase(`${action}_${scope}`)](resource);
	if (!permission.granted) {
		return ctx.throw(403, "Permission Denied");
	}
	ctx.state.permission = permission;
	return await next();
};

/*

let permission = acl.can(USER).readOwn("video");
console.log(permission.granted); // —> true
console.log(permission.attributes); // —> ['*'] (all attributes)
console.log(permission.filter({ id: 1, logs: 2 }));

permission = acl.can(ADMIN).createAny("video");
console.log(permission.granted); // —> true
console.log(permission.attributes); // —> ['title']


*/
