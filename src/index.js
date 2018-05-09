const reducer = require('./lib/selector');

const selector = {
  person: {
    address: {
      permanent: '#'
    }
  }
}
const obj = {
  person: {
    address: {
      permanent: [3, 4, 5, 6],
      temp: 'another temp'
    },
    name: 'robus gauli'
  }
}
const reduce = reducer(selector)
const result = reduce
  .append('new value')
  .append('again the new vaue')
  .apply(obj);

console.log(result, obj);

module.exports = reducer;

