var Reddit = require('reddit-client');
var fs = require('fs');

Reddit.authenticate({
  username: process.env['REDDIT_USERNAME'],
  password: process.env['REDDIT_PASSWORD'],
  disableThrottle: true
})

.then(function(reddit) {
  var comments = [];
  function getAfter(afterString) {
    return reddit.request({
      method: 'GET',
      path: '/live/ta535s1hq2je.json',
      query: afterString && { after: afterString } || undefined
    }).then(function(result) {
      if (!result.data.children) { return; }
      Array.prototype.push.apply(comments, result.data.children.map(function(comment) {
        console.log(comment.data.author,':',comment.data.body);
        return comment.data;
      }));
      return result.data.after && getAfter(result.data.after);
    });
  }
  
  return getAfter().then(function() {
    fs.writeFileSync('data.json', new Buffer(JSON.stringify(comments)));
  })
}).done();
