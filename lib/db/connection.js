const mongoose = require("mongoose");
const isProd = process.env.NODE_ENV == "production";

module.exports = async () => {
  return mongoose.connect(
    isProd ? process.env.MONGO_URL : process.env.MONGO_URL_DEV,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};
