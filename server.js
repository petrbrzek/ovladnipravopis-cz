require("dotenv").config();

const next = require("next");
const express = require("express");
const bcrypt = require("bcryptjs");

const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const mongooseModels = require("./lib/db/models");
const createConnection = require("./lib/db/connection");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
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
    cookieName: "adminbro", // TODO: save it to env
    cookiePassword: "secret",
  });

  server.use(adminBro.options.rootPath, router);
  server.use("/", router);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
