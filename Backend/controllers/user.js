const User = require("../models/user");
const Blog = require("../models/blog");

exports.getUserById = function (req, res, next, id) {
  User.findById(id).exec((err, foundUser) => {
    if (err || !foundUser) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = foundUser;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

//Data to be updated  is only - other than mail and password and blogs
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: true },
    (err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to update the user , Please try Again",
        });
      }
      return res.json(updatedUser);
    }
  );
};

exports.getUserAllBlogs = (req, res) => {
  Blog.find({ author: req.profile._id })
    .populate("author", "_id name")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "No blogs present for current user",
        });
      }
      return res.json(blogs);
    });
};

exports.pushBlogInUserProfile = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { blogs: req.body } },
    { new: true },
    (err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to Update the user profile with blogs",
        });
      }
      next();
    }
  );
};

//if someone wants to delete or update the blog then he can only do that if the he is the author of blog

exports.isUserBlog = (req, res, next) => {
  let a = JSON.stringify(req.profile._id);
  let b = JSON.stringify(req.blog.author._id);
  let checker = a === b ? true : false;
  if (!checker) {
    return res.status(400).json({
      error: "you doesn't own this blog",
    });
  }
  next();
};
