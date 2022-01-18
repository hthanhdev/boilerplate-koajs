const camelCase = require("camelcase");
const _ = require("lodash");

const transformSortedBy = (data) => {
  console.log(
    data
  );
  const results = [];
  for (const item of data) {
    results.push([camelCase(item.key), item.reverse ? "DESC" : "ASC"]);
  }
  return results;
};

const transformExcludeFields = (data) =>
  data
    .map((item) => {
      if (item !== "*") return item.replace("!", "");
    })
    .filter((item) => item);

const transformQuery = (data, excludes = []) => {
  let { page, size, sortedBy } = data;
  delete data.page;
  delete data.size;
  delete data.sortedBy;
  sortedBy = transformSortedBy(sortedBy);
  excludes = transformExcludeFields(excludes);
  return { page, size, sortedBy, query: _.omitBy(data, _.isNil), excludes };
};

const transformDataWithSchemaKeys = (data, schema) => {
  const result = {};
  for (const key in schema) {
    console.log("🚀 ~ file: query-transformer.js ~ line 35 ~ transformDataWithSchemaKeys ~ key", key)
    if ((_.has(data), key)) result[key] = data[key];
  }
  return result;
};

module.exports = {
  transformQuery,
  transformExcludeFields,
  transformDataWithSchemaKeys,
};
