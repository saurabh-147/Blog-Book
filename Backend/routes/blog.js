const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getUserById,
  pushBlogInUserProfile,
  isUserBlog,
} = require("../controllers/user");
const {
  createBlog,
  removeBlog,
  updateBlog,
  getAllBlogs,
  getABlog,
  getBlogById,
} = require("../controllers/blog");

//param routes
router.param("userId", getUserById);
router.param("blogId", getBlogById);

//actual Routes

//create a blog and push in author list
router.post(
  "/blog/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushBlogInUserProfile,
  createBlog
);

//delete a blog of the user(can only be performed by author )
router.delete(
  "/blog/delete/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  isUserBlog,
  removeBlog
);

//update a blog (can only be performed by author)
router.put(
  "/blog/update/:userId/:blogId",
  isSignedIn,
  isAuthenticated,
  isUserBlog,
  updateBlog
);

//get all blogs => call on home page
router.get("/blogs", getAllBlogs);

// get a blog with the given blog id
router.get("/blog/:blogId", getABlog);

module.exports = router;
