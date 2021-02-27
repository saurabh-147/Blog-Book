const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
  getUserAllBlogs,
} = require("../controllers/user");

//param route

//store userProfile in req.profile by using getuserByid
router.param("userId", getUserById);

//Actual Routes

//get info of user
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//update details of user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

//get all  blogs of the user with the given  userId
router.get("/blogs/user/:userId", isSignedIn, isAuthenticated, getUserAllBlogs);

module.exports = router;
