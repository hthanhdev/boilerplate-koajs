module.exports = async (ctx, next) => {
	for (const field in ctx.request.query) {
		try {
			ctx.request.query[field] = JSON.parse(ctx.request.query[field]);
		} catch (error) {
			return ctx.throw(400, `${field} in query is not a valid type`);
		}
	}
	return await next();
};
