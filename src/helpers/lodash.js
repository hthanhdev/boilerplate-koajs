const _ = require("lodash");

const checkAndSetDefaults = (obj, defaultValue) =>
	_.defaults(_.omitBy(obj, _.isNull), defaultValue);

module.exports = { checkAndSetDefaults };
