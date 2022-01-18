const { cfg } = require("../config");
const bcrypt = require("bcrypt");

const hash = (password) =>
	bcrypt.hashSync(
		password.trim(),
		bcrypt.genSaltSync(cfg("BCRYPT_SALT_ROUNDS", parseInt))
	);

const compare = (password, hashPassword) =>
	bcrypt.compareSync(password, hashPassword);

module.exports = { hash, compare };
