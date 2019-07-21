const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const key = require("../Setup/url").secret;
const Admin = require("../Models/AdminModel");

router.get("/getAdminDet", (req, res) => {
  jsonwt.verify(req.cookies.admin_t_auth, key, (err, user) => {
    if (user) {
      return res.json({
        email: user.email
      });
    }
  });
});

router.post("/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  const Admin_S = await Admin.findOne({ email });

  if (!Admin_S) {
    return res.json({ success: false, errMessage: "Admin not found." });
  } else {
    const payload = {
      email: Admin_S.email,
      password: Admin_S.password
    };

    bcrypt
      .compare(password, Admin_S.password)
      .then(isCorrect => {
        if (!isCorrect) {
          return res.json({
            success: false,
            errMessage: "Password Incorrect."
          });
        } else {
          jsonwt.sign(payload, key, { expiresIn: 9000000 }, (err, token) => {
            res.cookie("admin_t_auth", token, { maxAge: 90000000 });
            return res.json({
              success: true,
              errMessage: "Logged In..."
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
});

router.post("/adminRegister", (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password)
    return res.json({ success: false, errMessage: "Fill all fields." });

  if (password.length < 4)
    return res.json({ success: false, errMessage: "Password too short !" });

  Admin.findOne({ email })
    .then(adm => {
      if (adm) {
        return res.json({ success: false, errMessage: "Admin Already exists" });
      }
      let newAdmin = new Admin({
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          newAdmin.password = hash;
          newAdmin.save().catch(err => console.log(err));
        });
      });
      return res.json({ success: true, errMessage: "Admin registered." });
    })
    .catch(err => console.log(err));
});

router.get("/isLoggedIn", async (req, res) => {
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if (user) return res.json({ loggedIn: true });
    else return res.json({ loggedIn: false });
  });
});

router.get("/userInfo", async (req, res) => {
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if (user) {
      return res.json({
        email: user.email,
        username: user.username,
        description: user.description
      });
    }
  });
});

router.post("/register", async (req, res) => {
  const { username, email, password, age, gender, phone } = req.body.data;

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ success: false, errMessage: "User Already Exists" });
  } else {
    let newUser = new User({
      username,
      email,
      password,
      age,
      gender,
      phone
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        newUser.save().catch(err => console.log(err));
      });
    });
    return res.json({
      success: true,
      errMessage: "User Registered Successfully"
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body.data;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, errMessage: "User Doesn't exist." });
  } else {
    var payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    bcrypt
      .compare(password, user.password)
      .then(isCorrect => {
        if (!isCorrect)
          return res.json({
            success: false,
            errMessage: "Password Incorrect."
          });
        else {
          jsonwt.sign(payload, key, { expiresIn: 9000000 }, (err, token) => {
            res.cookie("auth_t", token, { maxAge: 90000000 });
            res.cookie("username", payload.username, { maxAge: 90000000 });
            return res.json({ success: true, errMessage: "Logged In..." });
          });
        }
      })
      .catch(err => console.log(err));
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_t");
  req.logout();
});

module.exports = router;
