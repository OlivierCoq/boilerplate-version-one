const _ = require('lodash');

const numbers = [33,445,66,44,55];

_.each(numbers, function(number, i){
  console.log(number);
});
