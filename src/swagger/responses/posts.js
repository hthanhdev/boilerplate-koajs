const genErrors = require("../errors");
module.exports = {
	"get-post": {
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
	"get-posts": {
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
	"create-post": {
		200: [
			{
				id: {
					type: "number",
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
