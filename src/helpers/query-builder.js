const { Op, fn, col, where } = require("sequelize");
const { snakeCase } = require("snake-case");
const accents = require("remove-accents");
const moment = require("moment");

const buildSearcher = (table, column, value) =>
	where(fn("lower", fn("unaccent", col(`${table}.${snakeCase(column)}`))), {
		[Op.iLike]: `%${accents.remove(value.toLowerCase())}%`,
	});

const buildTimer = (fromTime, toTime) => {
	if (fromTime && toTime) return { [Op.between]: [fromTime, toTime] };
	else if (fromTime) return { [Op.gte]: fromTime };
	else if (toTime) return { [Op.lt]: moment(toTime).add(1, "days") };
};

module.exports = { buildSearcher, buildTimer };
