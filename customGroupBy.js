// Custom groupBy function
function customGroupBy(array, keyFunc) {
    return array.reduce((result, item) => {
      const key = keyFunc(item);
      (result[key] = result[key] || []).push(item);
      return result;
    }, {});
  }
module.exports = customGroupBy