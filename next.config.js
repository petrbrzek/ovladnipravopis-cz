const withCSS = require("@zeit/next-css");

const isProd = process.env.NODE_ENV == "production";

module.exports = withCSS({
  env: {
    API_ENDPOINT: isProd ? "" : "http://localhost:3000"
  }
});
