const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: Buffer,
      contentType: String,
      // required: true,
    },
    author: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    // likes: {
    //   type: Number,
    //   default: 0,
    // },
    //comments
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
