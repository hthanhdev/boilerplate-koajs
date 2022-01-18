const Router = require("koa-router");
const { Op } = require("sequelize");
const queryConverter = require("../middlewares/query-converter");
const verifyToken = require("../middlewares/jwt-verify");
const verifyPermission = require("../middlewares/rbac-verify");
const validSchema = require("../swagger/requests/locations");
const validator = require("../middlewares/input-validator");
const { queryTransformer, queryBuilder } = require("require.all")("../helpers");
const { logs } = require("require.all")("../controllers");
const db = require("../models");
const router = new Router();

const includes = [
  {
    model: db.Location,
    as: "parent",
    attributes: ['id', 'name', 'type'],
    include: [
      {
        model: db.Location,
        as: "parent",
        attributes: ['id', 'name', 'type'],
        include: [
          {
            model: db.Location,
            as: "parent",
            attributes: ['id', 'name', 'type'],
            include: [
              {
                model: db.Location,
                as: "parent",
                attributes: ['id', 'name', 'type'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    model: db.Location,
    as: "children",
    attributes: ['id', 'name', 'type'],
    include: [
      {
        model: db.Location,
        as: "children",
        attributes: ['id', 'name', 'type'],
        include: [
          {
            model: db.Location,
            as: "children",
            attributes: ['id', 'name', 'type'],
            include: [
              {
                model: db.Location,
                as: "children",
                attributes: ['id', 'name', 'type'],
              },
            ],
          },
        ],
      },
    ],
  },
];

router.get(
  "/locations",
  queryConverter,
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "locations"),
  async (ctx, next) => await validator(ctx, next, validSchema[0]),
  async (ctx, next) => {
    let data = queryTransformer.transformDataWithSchemaKeys(
      ctx.request.query,
      validSchema[0].query
    );

    data = queryTransformer.transformQuery(data);
    const { page, size, query, sortedBy, excludes } = data;
    if (query.name) query.name = queryBuilder.buildSearcher("Location", "name", query.name);

    if (query.createdFrom || query.createdTo) {
      query.createdAt = queryBuilder.buildTimer(
        query.createdFrom,
        query.createdTo
      );
      delete query.createdFrom;
      delete query.createdTo;
    }

    try {
      ctx.body = await db.Location.getList(
        page,
        size,
        query,
        sortedBy,
        excludes,
        includes
      );
      return;
    } catch (error) {
      console.error(error);
      return ctx.throw(500);
    }
  }
);

router.get(
  "/location/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "locations"),
  async (ctx, next) => await validator(ctx, next, validSchema[1]),
  async (ctx, next) => {
    const id = ctx.params.id;
    try {
      let data = await db.Location.getOne(id, includes,);
      if (!data) {
        return ctx.throw(404);
      }
      ctx.body = data;
    } catch (error) {
      console.error(error);
      return ctx.throw(500);
    }
  }
);

module.exports = router;
