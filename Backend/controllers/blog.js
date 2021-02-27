const Blog = require("../models/blog");

exports.getBlogById = (req, res, next, id) => {
  Blog.findById(id)
    .populate("author", "_id name")
    .exec((err, foundBlog) => {
      if (err || !foundBlog) {
        return res.status(400).json({
          error: "No Blog Found in database",
        });
      }
      req.blog = foundBlog;
      next();
    });
};

exports.createBlog = (req, res) => {
  req.body.author = req.profile;
  const blog = new Blog(req.body);
  blog.save((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: "Blog not able to save in database , please try again",
      });
    }
    return res.json(blog);
  });
};

exports.removeBlog = (req, res) => {
  Blog.findByIdAndRemove({ _id: req.blog._id }, (err, removedBlog) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to remove,try again",
      });
    }
    return res.json({
      message: "Removed succesfully",
      removedBlog,
    });
  });
};

exports.updateBlog = (req, res) => {
  Blog.findOneAndUpdate(
    { _id: req.blog._id },
    { $set: req.body },
    { new: true, useFindAndModify: true },
    (err, updatedBlog) => {
      if (err) {
        return res.json({
          error: "Not able update your blog",
        });
      }
      return res.json(updatedBlog);
    }
  );
};

exports.getAllBlogs = (req, res) => {
  Blog.find()
    .populate("author", "_id name")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "No Blog Found",
        });
      }
      return res.json(blogs);
    });
};

exports.getABlog = (req, res) => {
  return res.json(req.blog);
};
