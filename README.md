livecounting-stats
==================

analysis tools for the Live Counting thread on Reddit Live

setup
-----

Currently this is three node.js scripts that use the reddit-client package.

[Install node](http://nodejs.org/download/). Then:

```shell
git clone git@github.com:rschaosid/livecounting-stats.git
cd livecounting-stats
npm install
```

usage
-----

```shell
export REDDIT_USERNAME=Unidan REDDIT_PASSWORD=password1
```

(Currently you need to provide Reddit credentials. I'll fix this soon.)

```shell
node index.js
```

This downloads the Live Counting thread. When it's done, data.json will contain an array of all the updates in the thread, most recent first.

```shell
node blame.js
```

This reads data.json and exports blame.json, which is an array of usernames indicating which user got which number.

```shell
node contrib.js
```

This reads blame.json and prints a contribution table, indicating how many counts each user is responsible for.
