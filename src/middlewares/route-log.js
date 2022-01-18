const { getLogger } = require("../services/logger");
const logger = getLogger("router");

const routeLog = async (ctx, next) => {
  const startTime = Date.now();
  let sign = "<->";
  let error = null;
  try {
    await next();
  } catch (e) {
    sign = "xxx";
    error = e;
  }
  let ms = Date.now() - startTime;
  logger.http(
    `${sign} ${ctx.request.method.toUpperCase().padStart(6, " ")}[${
      error ? error.status : ctx.response.status
    }] - ${ms}ms - ${ctx.request.url}`
  );
  if (null !== error) {
    ctx.throw(error.status, error.message);
  }
};

module.exports = { routeLog };
