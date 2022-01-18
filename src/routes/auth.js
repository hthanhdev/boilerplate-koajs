const {
  Op
} = require("sequelize");
const moment = require("moment");
const Router = require("koa-router");
const verifyToken = require("../middlewares/jwt-verify");
const verifyPermission = require("../middlewares/rbac-verify");
const validSchema = require("../swagger/requests/auth");
const validator = require("../middlewares/input-validator");
const {
  jwt,
  bcrypt,
  transformers
} = require("require.all")("../helpers");
const {
  logs
} = require("require.all")("../controllers");
const {
  queryTransformer,
  queryBuilder
} = require("require.all")("../helpers");
const db = require("../models");
const router = new Router();

router.post(
  "/sign-up",
  async (ctx, next) => await validator(ctx, next, validSchema[0]),
    async (ctx, next) => {
      let data = queryTransformer.transformDataWithSchemaKeys(
        ctx.request.body,
        validSchema[0].body
      );
      const dupUser = await db.User.findOne({
        where: {
          [Op.or]: {
            email: data.email,
            phone: data.phone,
          },
        },
      });
      if (dupUser) return ctx.throw(409, "Duplicate phone or email");

      data = {
        ...data,
        logs: logs.generator({}, {}, {
            status: logs.STATUS_TYPE_DRAFT,
          },
          logs.ACTION.CREATE
        ),
      };

      let create = null;
      try {
        create = await db.User.create(data);
      } catch (error) {
        console.log(error);
        return ctx.throw(500);
      }

      create = JSON.parse(JSON.stringify(create, null, ''))
      let user = null
      try {
        const includeFields = [];
        user = await db.User.getOne(
          create.id,
          ["password", "logs", "otp", "loginInfo"],
          includeFields
        );

        const tokenData = {
          id: create.id,
          phone: user.phone,
          email: user.email,
          type: user.type,
          name: user.name,
        };
        const token = await jwt.sign(tokenData);

        const loginInfo = {
          ...create.loginInfo,
          web: token,
          loginAt: moment().format(),
        };
        try {
          await db.User.update({
            loginInfo,
          }, {
            where: {
              id: create.id,
            },
          });
        } catch (error) {
          console.log(error);
          return ctx.throw(500);
        }
        user = transformers.modelToRawModel(user);

        user.data = Object.assign(user.data, {
          token,
        });
        return (ctx.body = user);
      } catch (error) {
        console.log(error);
        return ctx.throw(500);
      }
    }
);

router.post(
  "/sign-in",
  async (ctx, next) => await validator(ctx, next, validSchema[1]),
    async (ctx, next) => {
      const {
        email,
        password
      } = ctx.request.body;
      const user = await db.User.findOne({
        where: {
          email,
        },
      });
      if (!user) return ctx.throw(404, "Email not found");
      if (user.status === db.User.STATUS_INACTIVE)
        return ctx.throw(403, "User is not available");
      const isCorrectPassword = bcrypt.compare(password, user.password);
      if (!isCorrectPassword)
        return ctx.throw(403, "Email or password not correct");
      const tokenData = {
        id: user.id,
        phone: user.phone,
        email: user.email,
        type: user.type,
        name: user.name,
      };
      const token = await jwt.sign(tokenData);
      const loginInfo = {
        ...user.loginInfo,
        web: token,
        loginAt: moment().format(),
      };
      try {
        await user.update({
          loginInfo,
        });
      } catch (error) {
        console.log(error);
        return ctx.throw(500);
      }
      const includeFields = [];
      let data = await db.User.getOne(
        user.id,
        ["password", "logs", "otp", "loginInfo"],
        includeFields
      );
      data = transformers.modelToRawModel(data);
      data.data = Object.assign(data.data, {
        token,
      });
      return (ctx.body = {
        data: {
          token: data.data.token,
          message: "Signin success"
        }

      });
    }
);

router.post(
  "/sign-out",
  verifyToken,
  async (ctx, next) =>
    await verifyPermission(ctx, next, "update", "own", "users"),
    async (ctx, next) => {
      const user = ctx.state.user;
      const loginInfo = {
        ...user.loginInfo,
        web: "",
        loginAt: null,
      };
      try {
        await user.update({
          loginInfo,
        });
      } catch (error) {
        console.log(error);
        return ctx.throw(500);
      }
      ctx.body = {
        data: "Signout success",
      };
    }
);

module.exports = router;