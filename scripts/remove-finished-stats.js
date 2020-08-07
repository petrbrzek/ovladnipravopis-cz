require("dotenv").config();

const createConnection = require("../lib/db/connection");
const { UserStats } = require("../lib/db/models");

async function removeFinishedStats() {
  await createConnection();

  await UserStats.deleteMany({ state: "FINISHED" });

  console.log("Finished!");
}

removeFinishedStats();
