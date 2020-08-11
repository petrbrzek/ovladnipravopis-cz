const mongoose = require("mongoose");
const isProd = process.env.NODE_ENV == "production";

let called = false;

module.exports = async () => {
  if (called) {
    return;
  }
  called = true;
  try {
    return await mongoose.connect(
      isProd ? process.env.MONGO_URL : process.env.MONGO_URL_DEV,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (e) {
    console.error(e);
  }
};
