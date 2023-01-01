const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: String,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
