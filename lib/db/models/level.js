const mongoose = require("mongoose");

const { Schema } = mongoose;
const schema = new Schema(
  {
    levelId: {
      type: String,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    exercises: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exercise"
      }
    ],
    published: Boolean,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Level = mongoose.models.Level || mongoose.model("Level", schema);

module.exports = Level;
