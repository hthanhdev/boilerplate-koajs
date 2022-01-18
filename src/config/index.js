const dotenv = require("dotenv/config");

const cfg = (keyName, parseFunc = String) => {
  if (!parseFunc) return process.env[keyName];
  return parseFunc(process.env[keyName]);
};

export { cfg };
