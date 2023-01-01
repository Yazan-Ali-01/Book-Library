const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookGenreSchema = new Schema(
  {
    book_id: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    genre_id: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookGenre", bookGenreSchema);
