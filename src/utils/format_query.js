module.exports = {
  run: (query) => {
    let queryObject = {};
    for (let key in query) {
      if (query[key] != null) {
        queryObject[key] = query[key];
      }
    }
    return queryObject;
  },
};
