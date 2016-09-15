module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "CoderForgeACL.js": [
      "javascripts/CoderForgeACL.js"
    ],
    "bower_components/": [
        "bower_components/"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
