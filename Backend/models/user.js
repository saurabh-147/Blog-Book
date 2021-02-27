const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "Your name",
    },
    description: {
      type: String,
      required: false,
      default: "Your desc",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    blogs: {
      type: Array,
      default: [],
    },
    //bookmarks the blog
    //userFollowers
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (password) {
    return this.securePassword(password) == this.encry_password;
  },
  securePassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return err;
    }
  },
};

module.exports = mongoose.model("User", userSchema);
