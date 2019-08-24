const mongoose = require("mongoose");

const { Schema } = mongoose;
const schema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    correct: Boolean,
    published: Boolean
  },
  { timestamps: true }
);

const Card = mongoose.models.Card || mongoose.model("Card", schema);

module.exports = Card;
