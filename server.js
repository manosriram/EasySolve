const express = require("express");
const app = express();
require("dotenv").config();
const Port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const db = require("./Setup/url").url;
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

app.use(fileUpload());
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieparser());

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected !"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  return res.json({ message: "Default Route!" });
});

app.use("/auth", require("./Routes/Auth"));
app.use("/file", require("./Routes/Files"));
app.listen(Port, () => console.log(`Server at ${Port}`));

module.exports = app;
