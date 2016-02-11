var PreAnalyzer = function(num) { // constructor
  this.num = num;
}

PreAnalyzer.prototype.add = function(num2) { // instance method
  this.num += num2;
}

PreAnalyzer.subtract = function(num1, num2) { // static method
  return num1 - num2;
}

// set the module for this file
module.exports = PreAnalyzer;
