const genErrors = require("../errors");
module.exports = {
	"get-location": {
		200: [
			{
				id: {
					type: "number",
				},
				parentId: {
					type: "number",
				},
				name: {
					type: "string",
				},
				type: {
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
	"get-locations": {
		200: [
			{
				id: {
					type: "number",
				},
				parentId: {
					type: "number",
				},
				type: {
					type: "number",
				},
				name: {
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
