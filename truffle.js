module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "bower_components/": [
        "bower_components/"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
  },
  rpc: {
    host: "localhost",
    port: 8545,
    gas: 4712388,
    gasPrice: 50000000000
  }
};
