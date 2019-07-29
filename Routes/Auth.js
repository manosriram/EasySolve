const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const key = require("../Setup/url").secret;
const Admin = require("../Models/AdminModel");
const nodemailer = require("nodemailer");
const Ck = require("js-cookie");

const makeRandURLWRD = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.patch("/updatePassword", (req, res) => {
  const { password } = req.body.userData;
  const email = req.cookies.em_us_.split("__++__++")[0];

  User.findOneAndUpdate({ email })
    .then(user => {
      user.password = password;

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          user.save().catch(err => console.log(err));
        });
      });

      user.save();
      res.clearCookie("em_us_");
      res.clearCookie("scs");
      return res.json({
        success: true,
        message: "Successfully Changed Password."
      });
    })
    .catch(() => res.json({ success: false, message: "Error Occured.." }));
});

router.get("/forgotPassword/:randWr/:otp", (req, res) => {
  if (!req.cookies.fp_rand_url_ot_local) {
    return res.json({
      success: false,
      message: "Session Expired. Try clicking the link within 10 mins."
    });
  } else {
    const randAlpha = req.cookies.fp_rand_url_ot_local.split("_-_-__--")[0];
    const ck = req.cookies.fp_rand_url_ot_local.split("_-_-__--")[1];

    if (ck === req.params.otp && randAlpha === req.params.randWr) {
      res.clearCookie("fp_rand_url_ot_local");
      res.cookie("scs", true);
      res.redirect("http://localhost:3000/forgotPassword");
    } else {
      res.cookie("scs", false);
      return res.json({
        success: false,
        message: "Session Expired. Try clicking the link within 10 mins."
      });
    }
  }
});

router.post("/forgotPassword", (req, res) => {
  const OTP = Math.floor(Math.random() * 90000) + 10000;
  const { email } = req.body.email;
  User.findOne({ email })
    .then(user => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "easysolve.co.in@gmail.com",
          pass: "Easysolve@2019"
        }
      });

      const randW = makeRandURLWRD(80);
      const lnk = `http://localhost:5000/auth/forgotPassword/${randW}/${OTP}`;
      var date = new Date();
      date.setTime(date.getTime() + 600 * 1000);

      var em = user.email + "__++__++" + makeRandURLWRD(30);
      res.cookie("em_us_", em, { maxAge: date });
      res.cookie("fp_rand_url_ot_local", `${randW}_-_-__--${OTP}`, {
        maxAge: date
      });

      const htmlTemplate = `
        <h3>Oops ! Looks like you forgot your password. Don't Worry, Just click <a href=${lnk}>here</a> to verify your Email !</h3>
        <br/>
        <h3>This is a one-time link and Expires in 10mins. Make sure you Verify in 10 mins.</h3>
        <br/>
        <h3>Thank You ! 😇</h3>
        <br/>
        <strong>Easy Solve.</strong>
      `;

      const mailOptions = {
        from: "easysolve.co.in@gmail.com", // sender address
        to: user.email, // list of receivers
        subject: "Easy-Solve Forgot Password", // Subject line
        html: htmlTemplate
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: "Error Sending Message.."
          });
        } else {
          return res.json({
            success: true,
            message: "Please check your Email.."
          });
        }
      });
    })
    .catch(() => {
      return res.json({ success: false, message: "Email is not Registered.." });
    });
});

router.get("/getAdminDet", (req, res) => {
  jsonwt.verify(req.cookies.admin_t_auth, key, (err, user) => {
    if (user) {
      return res.json({
        success: true,
        email: user.email
      });
    } else {
      return res.json({
        success: false
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
