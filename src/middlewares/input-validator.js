const { validation } = require("swagger-generator-koa");
const statusCode = 400;
const errorName = "Bad Request";
// because of next func is in validation function, so if next function
// will catch error, this catch will also handle that error and make confict
// error handle. So use statusText in format of this validation catch as point
// to separate error of input and other when we catch in next and next step
module.exports = async (ctx, next, schema) => {
	try {
		await validation(schema)(ctx, next);
	} catch (error) {
		if (error.statusText) {
			ctx.status = error.status;
			ctx.body = {
				statusCode,
				error: errorName,
				message: error.statusText,
				properties: error.errors.map((item) => ({
					field: item.field.join(", "),
					location: item.location,
					message: item.messages
				})),
			};
		} else {
			ctx.throw(error);
		}
	}
};
