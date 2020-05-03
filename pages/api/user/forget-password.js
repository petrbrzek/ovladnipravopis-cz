const crypto = require("crypto");
const get = require("lodash.get");
const sgMail = require("@sendgrid/mail");

const User = require("../../../lib/db/models/user");

module.exports = async (req, res) => {
  const email = get(req, "body.email");

  if (email == null) {
    res.status(401).json({ error: "E-mail nebyl vyplněn." });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res
      .status(401)
      .json({ error: "Tento e-mail neevidujeme v naší databázi." });
    return;
  }

  const uniqueId = crypto.randomBytes(64).toString("hex");

  existingUser.resetPasswordExpire = new Date().getTime() + 1000 * 60 * 60 * 5;
  existingUser.resetPasswordToken = uniqueId;

  await existingUser.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const resetPasswordLink = `${process.env.APP_URL}/reset-password?token=${uniqueId}`;

  const msg = {
    to: email,
    from: "info@ovladnipravopis.cz",
    subject: "🦊 Ovládni pravopis - Obnovení hesla",
    text: `Pokračujte kliknutím na odkaz pro obnovení hesla ${resetPasswordLink}.`,
  };

  try {
    await sgMail.send(msg);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Došlo k chybě při zpracovávání požadavku." });
    return;
  }

  res.status(200).json({});
};
