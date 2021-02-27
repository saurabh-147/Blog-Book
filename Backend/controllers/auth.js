const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");

//Controllers

//Signin
exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, foundUser) => {
    //check for any error or if no user is found
    if (err || !foundUser) {
      return res.status(400).json({
        error: "User email doesn't exist",
      });
    }

    if (!foundUser.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password does not match",
      });
    }

    //1) If all goes well  create a token
    //2) then store in cookies

    //create token => using foundUser id(we can make token by anything)
    const token = jwt.sign({ _id: foundUser._id }, process.env.SECRET);

    //Now put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //Send response to front end
    const { _id, name, email } = foundUser;
    return res.json({
      token: token,
      user: {
        _id,
        // name,
        // email,
      },
    });
  });
};

//Signup
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }

    return res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//Signout
exports.signout = (req, res) => {
  console.log("user signout");
  res.clearCookie("token");
  res.json({
    message: "User signout",
  });
};

//Protected Routes

//isSignedIn
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//Note that middlewares contain next function to call to next stage if all goes well

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};
