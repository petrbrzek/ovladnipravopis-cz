const mongoose = require("mongoose");

const { Schema } = mongoose;
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    exercise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Exercise"
    },
    state: {
      type: String,
      required: true,
      enum: ["OPEN", "FAILED", "FINISHED"]
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: "Card"
    }
  },
  { timestamps: true }
);

const UserStats =
  mongoose.models.UserStats || mongoose.model("UserStats", schema);

module.exports = UserStats;
