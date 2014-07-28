var fs = require('fs');

var data = JSON.parse(fs.readFileSync('data.json').toString()).reverse();

var authorsByValue = [], max = -Infinity, min = Infinity;
var bad = [], duplicate = [], missing = [], valid = 0;

var comment, val;
for(var i=0;i<data.length;i++) {
  comment = data[i];
  val = /^[~`#*_\s\[]*([1-9]\d{0,2}(?:,\d{3})*|[1-9]\d{3})(?:[^\d](?:.|\n)*)?$/.exec(comment.body);
  if (val)
    { val = parseInt(val[1].replace(/,/g, '')); }
  else {
    if (!comment.stricken) {
      bad.push({
        'kind': 'bad update',
        'name': comment.name,
        'author': comment.author,
        'body': comment.body
      });
    }
    continue;
  }
  if (authorsByValue[val]) {
    if (!comment.stricken) {
      duplicate.push({
        'kind': 'duplicate value',
        'value': val,
        'name': comment.name,
        'otherAuthor': authorsByValue[val],
        'author': comment.author,
        'body': comment.body
      });
    }
  }
  else {
    valid++;
    authorsByValue[val] = comment.author;
    max = Math.max(max, val);
    min = Math.min(min, val);
  }
}

if (max > -Infinity && min < Infinity) {
  for (var i=min; i<=max; i++) {
    if (!authorsByValue[i]) {
      missing.push({
        'kind': 'missing value',
        'value': i
      });
    }
  }
}

console.log(data.length+' comments processed');
console.log(valid+' of them are valid');
console.log('comments were valued from '+min+' to '+max);
console.log((bad.length+duplicate.length+missing.length)+' anomalies were found:');
console.log('* '+bad.length+' bad (malformatted) updates');
console.log('* '+duplicate.length+' duplicate values');
console.log('* '+missing.length+' missing values');

fs.writeFileSync('blame.json', new Buffer(JSON.stringify(authorsByValue)));
fs.writeFileSync('blame-anomalies.json', new Buffer(JSON.stringify({bad: bad, duplicate: duplicate, missing: missing})));
