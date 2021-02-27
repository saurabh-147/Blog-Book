require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(process.env.DataBase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected ");
  });

//middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

app.listen(process.env.port || 8000, () => {
  console.log("server  connected at port  8000");
});
