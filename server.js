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
app.use(express.static(path.join(__dirname + "client/build")));
app.use(express.json());
app.use(cookieparser());
app.use("/auth", require("./Routes/Auth"));
app.use("/file", require("./Routes/Files"));

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected !"))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(Port, () => console.log(`Server at ${Port}`));
module.exports = app;
