const Joi = require("@hapi/joi");
const db = require("../../models");
const defaults = require("../defaults");

const schema = {
  id: Joi.number().min(1),
  ids: Joi.number().default([]),
  parentId: Joi.number().min(1),
  name: Joi.string(),
  type: Joi.number()
    .valid(...db.Location.TYPES)
    .default(null),
  createdFrom: Joi.date().default(null),
  createdTo: Joi.date().default(null),
  page: Joi.number().min(1).default(defaults.page),
  size: Joi.number().min(1).max(100).default(defaults.size),
  sortedBy: Joi.array()
    .items(
      Joi.object({
        key: Joi.string()
          .valid(...db.Location.SORTED_KEYS)
          .default(defaults.sortedKey),
        reverse: Joi.boolean().default(defaults.reverse),
      })
    )
    .unique((prev, next) => prev.key === next.key)
    .default([{ key: defaults.sortedKey, reverse: defaults.reverse }]),
  getAll: Joi.string(),
};

module.exports = {
  0: {
    query: {
      page: schema.page,
      size: schema.size,
      sortedBy: schema.sortedBy,
      createdFrom: schema.createdFrom,
      createdTo: schema.createdTo,
      type: schema.type,
      parentId: schema.parentId,
      name: schema.name,
      getAll: schema.getAll,
    },
    headers: {},
    model: "get-locations",
    group: "posts",
  },
  1: {
    params: {
      id: schema.id.required(),
    },
    headers: {},
    model: "get-location",
    group: "posts",
  },
};
