const Router = require("koa-router");
const queryConverter = require("../middlewares/query-converter");
const verifyToken = require("../middlewares/jwt-verify");
const verifyPermission = require("../middlewares/rbac-verify");
const validSchema = require("../swagger/requests/users");
const validator = require("../middlewares/input-validator");
const {
  queryTransformer,
  queryBuilder,
  transformers,
  bcrypt
} =
require("require.all")("../helpers");
const moment = require("moment")
const db = require("../models");
const router = new Router();
const {
  logs
} = require("require.all")("../controllers");
const includeFields = (userExcludeFields) => [{
  model: db.Location,
  as: "area",
  include: [{
    model: db.Location,
    as: "parent",
    include: [{
      model: db.Location,
      as: "parent",
      include: [{
        model: db.Location,
        as: "parent",
      }, ],
    }, ],
  }, ],
}, ];

router.get(
  "/users",
  queryConverter,
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[0]),
      async (ctx, next) => {
        let data = queryTransformer.transformDataWithSchemaKeys(
          ctx.request.query,
          validSchema[0].query
        );
        let excludeFields = ctx.state.permission.attributes;
        data = queryTransformer.transformQuery(data, excludeFields);
        const {
          page,
          size,
          query,
          sortedBy,
          excludes
        } = data;
        if (query.name)
          query.name = queryBuilder.buildSearcher("User", "name", query.name);
        if (query.address)
          query.address = queryBuilder.buildSearcher(
            "User",
            "address",
            query.address
          );
        if (query.representName)
          query.representName = queryBuilder.buildSearcher(
            "User",
            "representName",
            query.representName
          );
        if (query.createdFrom || query.createdTo) {
          query.createdAt = queryBuilder.buildTimer(
            query.createdFrom,
            query.createdTo
          );
          delete query.createdFrom;
          delete query.createdTo;
        }
        try {
          let results = await db.User.getList(
            page,
            size,
            query,
            sortedBy,
            excludes,
            includeFields(excludeFields)
          );
          if (results.data.length) {
            results = transformers.modelToRawModel(results);

            results.data = results.data.map((user) => {
              let {
                area
              } = user;
              area = transformers.TreeLocationToLine(area, db.Location.JSON_TYPES);

              delete user.area;
              return {
                ...user,
                ...area
              };
            });
          }

          return (ctx.body = results);
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
      }
);

router.get(
  "/users/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[1]),
      async (ctx, next) => {
        const id = ctx.params.id;
        let excludeFields = ctx.state.permission.attributes;
        excludeFields = queryTransformer.transformExcludeFields(excludeFields);

        let result;
        try {
          result = await db.User.getOne(
            id,
            excludeFields,
            includeFields(excludeFields)
          );
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
        if (result.data) {
          result = transformers.modelToRawModel(result);
          let {
            area
          } = result.data;
          area = transformers.TreeLocationToLine(area, db.Location.JSON_TYPES);
          delete result.data.area;
          result.data = {
            ...result.data,
            ...area
          };
        }
        return (ctx.body = result);
      }
);

router.put(
  "/users/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[1]),
      async (ctx, next) => {
        const id = ctx.params.id;
        let {
          websites,
          images,
          areaId,
          parentId,
          name,
          address,
          description,
          representName,
          gender,
          birthday,
          totalMembers,
        } = ctx.request.body;
        const user = ctx.state.user;
        const data = await db.User.findOne({
          where: {
            id: id,
          },
        });

        if (!data) {
          return ctx.throw(404);
        }

        let dataUpdate = {
          websites: websites || data.websites,
          images: images || data.images,
          areaId: areaId || data.areaId,
          parentId: parentId || data.parentId,
          name: name || data.name,
          address: address || data.address,
          description: description || data.description,
          representName: representName || data.representName,
          gender: gender || data.gender,
          birthday: birthday || data.birthday,
          totalMembers: totalMembers || data.totalMembers,
        };
        let userLogs = logs.generator(user,
          data,
          dataUpdate,
          logs.ACTION.UPDATE,
          data.logs
        )
        dataUpdate.logs = userLogs
        try {
          await data.update(dataUpdate);
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
        try {
          let a = await db.User.getOne(id);
          return;
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
      }
);

router.put(
  "/users-password/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[1]),
      async (ctx, next) => {
        const user = ctx.state.user;
        const id = ctx.params.id;

        let {
          password,
          oldPassword
        } = ctx.request.body;
        const data = await db.User.findOne({
          where: {
            id: id,
          },
        });

        if (!data) {
          return ctx.throw(404);
        }

        const isCorrectPassword = bcrypt.compare(oldPassword, user.password);
        if (!isCorrectPassword)
          return ctx.throw(403, "Old password not correct");
        try {
          await data.update({
            password: password,
          });
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
        try {
          return ctx.body = await db.User.getOne(id, ['password']);
          return;
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
      }
);

router.put(
  "/users-status/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[1]),
      async (ctx, next) => {
        const user = ctx.state.user;
        const id = ctx.params.id;

        let {
          status
        } = ctx.request.body;
        const data = await db.User.findOne({
          where: {
            id: id,
          },
        });

        if (!data) {
          return ctx.throw(404);
        }

        try {
          await data.update({
            status: status,
          });
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
        try {
          ctx.body = await db.User.getOne(id);
          return;
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
      }
);

router.del(
  "/users/:id",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "read", "any", "users"),
    async (ctx, next) => await validator(ctx, next, validSchema[1]),
      async (ctx, next) => {
        const user = ctx.state.user;
        const id = ctx.params.id;
        const status = db.User.STATUS_DELETED
        const data = await db.User.findOne({
          where: {
            id: id,
          },
        });

        if (!data) {
          return ctx.throw(404);
        }

        try {
          await data.update({
            status: status,
            deletedAt: moment()
          });
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
        try {
          ctx.body = await db.User.getOne(id);
          return;
        } catch (error) {
          console.error(error);
          return ctx.throw(500);
        }
      }
);
module.exports = router;