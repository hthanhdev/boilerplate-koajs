const {
	jwt
} = require("require.all")("../helpers");

const verifyToken = async (ctx, next) => {
	let user = {};
	try {
		user = await jwt.verify(ctx);
	} catch (error) {
		ctx.throw(error);
	}
	if (!user.loginInfo) {
		return ctx.throw(401, "Invalid Token");
	}
	if (user.loginInfo.web !== ctx.request.token)
		return ctx.throw(401, "Invalid Token");
	ctx.state = {
		user
	};
	await next();
};

module.exports = verifyToken;