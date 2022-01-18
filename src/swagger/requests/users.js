const Joi = require("@hapi/joi");
const db = require("../../models");
const patterns = require("../patterns");
const defaults = require("../defaults");

const schema = {
	id: Joi.number(),
	email: Joi.string().pattern(patterns.email),
	phone: Joi.string().pattern(patterns.phone),
	password: Joi.string().pattern(patterns.password),
	gender: Joi.number()
		.valid(...db.User.GENDERS)
		.default(db.User.GENDER_UNKNOWN),
	type: Joi.number()
		.valid(...db.User.TYPES)
		.default(db.User.TYPE_PERSONAL),
	status: Joi.number()
		.valid(...db.User.STATUSES)
		.default(db.User.STATUS_ACTIVE),
	images: Joi.object({
		image: Joi.string().required(),
		altText: Joi.string().default(""),
	}), //.default(defaults.images)
	name: Joi.string(),
	birthday: Joi.date(),
	createdFrom: Joi.date(),
	createdTo: Joi.date(),
	address: Joi.string(),
	areaId: Joi.number(),
	representName: Joi.string(),
	description: Joi.string(),
	parentId: Joi.number(),
	websites: Joi.object({
		facebook: Joi.string().pattern(patterns.url),
	}), //.default(defaults.websites)
	totalMembers: Joi.number().min(0), //.default(0)
	page: Joi.number().min(1).default(defaults.page),
	size: Joi.number().min(1).max(100).default(defaults.size),
	sortedBy: Joi.array()
		.items(
			Joi.object({
				key: Joi.string()
					.valid(...db.User.SORTED_KEYS)
					.default(defaults.sortedKey),
				reverse: Joi.boolean().default(defaults.reverse),
			})
		)
		.unique((prev, next) => prev.key === next.key)
		.default([{
			key: defaults.sortedKey,
			reverse: defaults.reverse,
		}, ]),
};

module.exports = {
	0: {
		query: {
			page: schema.page,
			size: schema.size,
			sortedBy: schema.sortedBy,
			id: schema.id,
			email: schema.email,
			phone: schema.phone,
			name: schema.name,
			createdFrom: schema.createdFrom,
			createdTo: schema.createdTo,
			address: schema.address,
			areaId: schema.areaId,
			representName: schema.representName,
			description: schema.description,
		},
		headers: {},
		model: "get-users",
		group: "users",
	},
	1: {
		params: {
			id: schema.id.required(),
		},
		body: {
			//...
		},
		headers: {},
		model: "get-user",
		group: "users",
	},
};