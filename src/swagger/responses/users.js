const genErrors = require("../errors");
module.exports = {
	"sign-up": {
		200: [
			{
				id: {
					type: "number",
				},
				name: {
					type: "string",
				},
				address: {
					type: "string",
				},
				createdAt: {
					type: "number",
					format: "date-time",
				},
				updatedAt: {
					type: "number",
					format: "date-time",
				},
			},
		],
		...genErrors([400, 401, 403, 500]),
	},
};
