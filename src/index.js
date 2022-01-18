const { cfg } = require("./config");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const swagger = require("swagger-generator-koa");
const koa404Handler = require("koa-404-handler");
const errorHandler = require("koa-better-error-handler");
const { bearerToken } = require("koa-bearer-token");
const mount = require("koa-mount");
const { routeLog } = require("./middlewares/route-log");
const whiteListOrigin = require("./middlewares/white-list-origin");
const routers = require("./routes");
require("./rbac").refreshRBAC();

const app = new Koa();

app.use(routeLog);

swagger.serveSwagger(
	app,
	"/docs",
	{
		title: "swagger-generator-koa",
		version: "1.0.0",
		host: `  ${cfg("APP_HOST")}:${cfg("APP_PORT")}`,
		basePath: "/",
		schemes: ["http", "https"],
		securityDefinitions: {
			Bearer: {
				description:
					"Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM",
				type: "apiKey",
				name: "Authorization",
				in: "header",
			},
		},
		security: [
			{
				Bearer: [],
			},
		],
		defaultSecurity: "Bearer",
	},
	{
		routePath: "./src/routes/",
		requestModelPath: "./src/swagger/requests",
		responseModelPath: "./src/swagger/responses",
	}
);

app.context.onerror = errorHandler();
app.context.api = true;
app.use(koa404Handler);
app.use(whiteListOrigin);
app.use(
	bodyParser({
		enableTypes: ["json"],
		extendTypes: ["application/json"],
		onerror: (err, ctx) => {
			ctx.throw(422, "Body Parser error");
		},
	})
);
app.use(
	bearerToken({
		queryKey: "token",
		headerKey: "Bearer",
	})
);
app.use(mount("/v1", routers()));

app.listen(cfg("APP_PORT", parseInt), cfg("APP_HOST"));
console.info(
	`API Server started at http://%s:%d`,
	cfg("APP_HOST"),
	cfg("APP_PORT", parseInt)
);
