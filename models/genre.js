const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Genre", genreSchema);
