var fs = require('fs'),
    util = require('util');

var data = JSON.parse(fs.readFileSync('blame.json').toString());

var totals = {};

data.forEach(function(author) {
  if (author) {
    if (!totals[author]) { totals[author] = 0; }
    totals[author]++;
  }
});

Object.keys(totals).sort().sort(function compare(a, b) {
  return totals[b] - totals[a];
}).forEach(function(author) {
  console.log(author+' | '+totals[author]);
});
