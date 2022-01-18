const getList = async (
  model,
  page,
  size,
  query,
  sortedBy,
  excludes,
  includes
) => {
  let conditions = {
    where: query,
    attributes: {
      exclude: excludes,
    },
    order: sortedBy,
    include: includes,
  };
  let hasNextPage = 0;
  let hasPreviousPage = 0;
  if (query.getAll) {
    delete query.getAll;
    hasNextPage = false;
    hasPreviousPage = false;
  } else if (page && size) {
    conditions.offset = (page - 1) * size;
    conditions.limit = size;
  }
  const results = await model.findAll(conditions);
  const total = await model.count({
    where: query,
    include: includes,
  });

  if (page) {
    hasNextPage = (page - 1) * size + size < total ? true : false;
    hasPreviousPage = page - 1 > 0 ? true : false;
  } else {
    size = total;
  }

  return {
    pageInfo: {
      total,
      page,
      size,
      hasNextPage,
      hasPreviousPage,
    },
    data: results,
  };
};

const getOne = async (model, id, excludes, includes) => {
  const result = await model.findOne({
    where: { id },
    attributes: {
      exclude: excludes,
    },
    include: includes,
  });
  return { data: result };
};

module.exports = {
  getList,
  getOne,
};
