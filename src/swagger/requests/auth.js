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
	totalMembers: Joi.number(), //.default(0)
	page: Joi.number().min(1).default(defaults.page),
	size: Joi.number().min(1).max(100).default(defaults.size),
	roleId: Joi.number(),
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
		.default([{ key: defaults.sortedKey, reverse: defaults.reverse }]),
};

module.exports = {
	0: {
		body: {
			name: schema.name.required(),
			email: schema.email.required(),
			password: schema.password.required(),
			phone: schema.phone.required(),
			type: schema.type,
			representName: schema.representName,
			websites: schema.websites,
			address: schema.address,
			gender: schema.gender,
			images: schema.images,
			birthday: schema.birthday,
			totalMembers: schema.totalMembers,
			description: schema.description,
			roleId: schema.roleId,
		},
		model: "sign-up",
		group: "auth",
	},
	1: {
		body: {
			password: schema.password.required(),
			email: schema.email.required(),
		},
		model: "sign-in",
		group: "auth",
	},
	2: {
		header: {},
		model: "sign-out",
		group: "auth",
	},
	3: {
		body: {
			name: schema.name,
			password: schema.password,
			phone: schema.phone,
			representName: schema.representName,
			websites: schema.websites,
			address: schema.address,
			gender: schema.gender,
			images: schema.images,
			birthday: schema.birthday,
			totalMembers: schema.totalMembers,
			description: schema.description,
		},
		model: "update-password",
		group: "auth",
	},
};
