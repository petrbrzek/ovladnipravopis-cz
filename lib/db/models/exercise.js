const mongoose = require("mongoose");

const { Schema } = mongoose;
const schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String
    },
    published: Boolean,
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card"
      }
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", schema);

module.exports = Exercise;
