require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");

const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const mongooseModels = require("./lib/db/models");
const createConnection = require("./lib/db/connection");

const port = parseInt(process.env.PORT, 10) || 3000;

const start = async () => {
  const app = express();
  const mongooseDb = await createConnection();

  const adminBro = new AdminBro({
    databases: [mongooseDb],
    resources: Object.keys(mongooseModels).map((key) => mongooseModels[key]),
  });

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      try {
        const user = await mongooseModels.User.findOne({ email });
        const validPassword = await bcrypt.compare(password, user.password);
        if (user.role === "admin" && validPassword) {
          return true;
        }
      } catch (e) {}
      return false;
    },
    cookieName: "adminbro",
    cookiePassword: process.env.ADMIN_COOKIE_SECRET,
  });

  app.use(adminBro.options.rootPath, router);
  app.use("/", router);

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
};

start();
