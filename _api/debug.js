const Photon = require("@generated/photon");

const photon = new Photon.default();

console.log("test", process.env.MONGO_URL);

module.exports = async (req, res) => {
  const result = await photon.levels.findMany();
  res.status(200).json(result);
};
