const { cfg } = require("../config");
const cors = require("kcors");

const checkOriginAgainstWhitelist = (ctx) => {
  const requestOrigin = ctx.accept.headers.origin;
  if (cfg("WHITELIST", JSON.parse).includes("*")) {
    return "*";
  }
  if (!cfg("WHITELIST", JSON.parse).includes(requestOrigin)) {
    if (requestOrigin.search(/(http|https)/) === 0) {
      return ctx.throw(`${requestOrigin} is not a valid origin`);
    } else {
      //allow if it is an application. not web page
      return null;
    }
  }
  return requestOrigin;
};

module.exports = cors({
  origin: checkOriginAgainstWhitelist,
  maxAge: 86400,
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
});
