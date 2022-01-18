const AccessControl = require("accesscontrol");
const _ = require("lodash");
const db = require("../models");

let grantList = [];

const getAllPermissionsOfInheritRole = (
	role,
	roles,
	grantList,
	masterRoleId
) => {
	const inherits = roles.filter((item) => {
		return (
			role.inheritFromRoleIds.includes(item.id) &&
			!item.inheritFromRoleIds.includes(role.id)
		);
	});
	for (const inherit of inherits) {
		if (inherit.inheritFromRoleIds.length !== 0) {
			getAllPermissionsOfInheritRole(inherit, roles, grantList, masterRoleId);
		}
		for (const permission of inherit.permissions) {
			grantList.push({
				role: masterRoleId,
				resource: permission.resource,
				action: `${permission.action}:${permission.actionScope}`,
				attributes: _.compact(permission.denyOnAttributes), // remove all falsy item if exist
			});
		}
	}
};

const refreshRBAC = async () => {
	grantList = [];

	// get all roles
	const roles = await db.Role.findAll({
		where: {},
		include: [
			{
				model: db.Permission,
				as: "permissions",
			},
		],
	});

	// gen simple grant list with permissions head to role
	for (const role of roles) {
		for (const permission of role.permissions) {
			grantList.push({
				role: role.id + "",
				resource: permission.resource,
				action: `${permission.action}:${permission.actionScope}`,
				attributes: _.compact(permission.denyOnAttributes),
			});
		}
	}

	// improve grant list with inherit role
	for (const role of roles) {
		if (role.inheritFromRoleIds.length !== 0)
			getAllPermissionsOfInheritRole(role, roles, grantList, role.id + "");
	}

	// group grant list by role
	grantList = _.groupBy(grantList, _.property("role"));

	// remove all child permissions, example: if exist read:any and read:own on 1 resource, read:own will be remove from this list
	for (const role in grantList) {
		for (const permission of grantList[role]) {
			if (permission.action.includes("any")) {
				grantList[role] = grantList[role].filter(
					(item) => item.action !== `${permission.action.split(":")[0]}:own`
				);
			}
		}
	}

	// group grant list by resource
	for (const role in grantList) {
		grantList[role] = _.groupBy(grantList[role], _.property("resource"));
	}
	for (const role in grantList) {
		for (const resource in grantList[role]) {
			grantList[role][resource] = _.groupBy(
				grantList[role][resource],
				_.property("action")
			);
		}
	}

	// improve grant list with the same part of 2 permission in same
	for (const role in grantList) {
		for (const resource in grantList[role]) {
			for (const action in grantList[role][resource]) {
				for (const permission of grantList[role][resource][action]) {
					if (permission.attributes.length === 0) {
						grantList[role][resource][action] = [permission];
						break;
					} else {
						let attributesList = grantList[role][resource][action].map(
							(item) => item.attributes
						);
						const attributesResult = attributesList
							.shift()
							.reduce((result, value) => {
								if (
									result.indexOf(value) === -1 &&
									attributesList.every((list) => {
										return list.indexOf(value) !== -1;
									})
								)
									result.push(value);
								return result;
							}, []);
						grantList[role][resource][action] = [
							{ ...permission, attributes: attributesResult },
						];
					}
				}
			}
		}
	}

	let results = [];
	for (const role in grantList) {
		for (const resource in grantList[role]) {
			for (const action in grantList[role][resource]) {
				for (const permission of grantList[role][resource][action]) {
					results = results.concat(permission);
				}
			}
		}
	}
	results = results.map((item) => ({
		...item,
		attributes:
			item.attributes.length === 0
				? "*"
				: (() => {
						item.attributes.unshift("*");
						return item.attributes.join(", !");
				  })(),
	}));
	grantList = results;

	// set new RBAC list
	global.rbac = new AccessControl(grantList);
	console.log("RBAC is ready to be used");
};

module.exports = {
	refreshRBAC,
};
