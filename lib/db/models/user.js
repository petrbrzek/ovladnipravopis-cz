const mongoose = require("mongoose");
const isEmail = require("isemail");

const { Schema } = mongoose;
const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: v => isEmail.validate(v),
        message: "Invalid e-mail"
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 4
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Number
    },
    name: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", schema);

module.exports = User;
