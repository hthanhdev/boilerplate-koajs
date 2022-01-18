const errors = [
	{ statusCode: 400, error: "Bad Request" },
	{ statusCode: 401, error: "Unauthorized" },
	{ statusCode: 402, error: "Payment Required" },
	{ statusCode: 403, error: "Forbidden" },
	{ statusCode: 404, error: "Not Found" },
	{ statusCode: 405, error: "Method Not Allowed" },
	{ statusCode: 406, error: "Not Acceptable" },
	{ statusCode: 407, error: "Proxy Authentication Required" },
	{ statusCode: 408, error: "Request Timeout" },
	{ statusCode: 409, error: "Conflict" },
	{ statusCode: 410, error: "Gone" },
	{ statusCode: 411, error: "Length Required" },
	{ statusCode: 412, error: "Precondition Failed" },
	{ statusCode: 413, error: "Payload Too Large" },
	{ statusCode: 414, error: "URI Too Long" },
	{ statusCode: 415, error: "Unsupported Media Type" },
	{ statusCode: 416, error: "Range Not Satisfiable" },
	{ statusCode: 417, error: "Expectation Failed" },
	{ statusCode: 500, error: "Internal Server Error" },
	{ statusCode: 501, error: "Not Implemented" },
	{ statusCode: 502, error: "Bad Gateway" },
	{ statusCode: 503, error: "Service Unavailable" },
	{ statusCode: 504, error: "Gateway Timeout" },
	{ statusCode: 505, error: "HTTP Version Not Supported" },
];

module.exports = (statusCodes) => {
	const results = {};
	for (const statusCode of statusCodes) {
		const error =
			errors.find((item) => item.statusCode === statusCode).error || "";
		results[statusCode] = {
			statusCode: {
				type: "integer",
				default: statusCode,
			},
			error: {
				type: "string",
				default: error,
			},
			message: {
				type: "string",
			},
			properties: {
				type: "object",
				properties: {},
				default: {},
			},
		};
	}
	return results;
};
