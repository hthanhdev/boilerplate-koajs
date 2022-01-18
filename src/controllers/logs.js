const moment = require("moment");
const { snakeCase } = require("snake-case");
const _ = require("lodash");
const helpers = require("require.all")("../helpers");

const USER_TYPE_GUEST = -1;
const STATUS_TYPE_DRAFT = 1;
const ACTION = {
	CREATE: "create",
	UPDATE: "update",
	DELETE: "delete",
};

const generator = (
	user,
	oldData,
	newData,
	action = ACTION.UPDATE,
	logs = { list: [], statuses: [] }
) => {
	const { id, name, email, phone, type } = user;
	const userInfo = helpers.lodash.checkAndSetDefaults(
		{ id, name, email, phone, type },
		{
			id: null,
			name: null,
			email: null,
			phone: null,
			type: USER_TYPE_GUEST,
		}
	);

	let result = {
		userInfo,
		createdAt: moment().format(),
	};

	if (_.has(newData, "status")) {
		result.status = newData.status;
		logs.statuses.push(result);
	}

	result = {
		...result,
		action,
		updateInfo: [],
	};
	for (const field in newData) {
		if (newData[field] != oldData[field] || JSON.stringify(newData[field]) === JSON.stringify(oldData[field])) {
			result.updateInfo.push({
				column: snakeCase(field),
				newData: newData[field],
				oldData: oldData[field],
			});
		}
	}
	logs.list.push(result);
	return logs;
};

module.exports = {
	ACTION,
	STATUS_TYPE_DRAFT,
	generator,
};
