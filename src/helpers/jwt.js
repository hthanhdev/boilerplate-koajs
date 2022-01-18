const fs = require("fs");
const jwt = require("jsonwebtoken");
const { cfg } = require("../config");
const db = require("../models");

const verifyFromUser = async (user) => {
	const token = user.loginInfo.web;
	const cert = await fs.readFileSync(cfg("JWT_PUBLIC_KEY"));
	try {
		jwt.verify(token, cert, {
			algorithm: "ES256",
		});
	} catch (errors) {
		return false;
	}
	return true;
};

const verify = async (ctx) => {
	const token = ctx.request.token;

	if (!token) return ctx.throw(401, "Token Required");

	const cert = await fs.readFileSync(cfg("JWT_PUBLIC_KEY"));
	let tokenData = null;
	try {
		tokenData = jwt.verify(token, cert, {
			algorithm: "ES256",
		});
	} catch (errors) {
		console.log("Err", errors);
		return ctx.throw(401, "Invalid Token");
	}
	const user = await db.User.findOne({
		where: {
			id: tokenData.id,
		},
	});
	if (!user) {
		return ctx.throw(401, "Invalid Token");
	}
	return user;
};

const sign = async (data) => {
	const cert = await fs.readFileSync(cfg("JWT_PRIVATE_KEY"));
	return jwt.sign(data, cert, {
		algorithm: "ES256",
	});
};

module.exports = { verify, sign, verifyFromUser };
