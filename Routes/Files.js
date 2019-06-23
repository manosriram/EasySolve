const express = require("express");
const router = express.Router();
const Question = require("../Models/QuestionModel");
const multer = require("multer");
const path = require("path");

router.post("/getUserQuestions", async (req, res) => {
  const { user } = req.body;

  const qs = await Question.find({ askedBy: user });

  return res.json({ questions: qs });
});

router.post("/addQuestion", (req, res) => {
  if (!req.files) {
    const { question, user } = req.body;
    const qs = new Question({
      askedBy: user,
      question
    });
    qs.save();
    return res.json({ success: true, message: "Question Added." });
  }

  let fl = req.files.imageFile;
  let newFileName = Date.now() + fl.name;
  const { question, user } = req.body;

  fl.mv(`${__dirname}/../public/${newFileName}`, err => {
    if (!err) console.log(`Uploaded ${newFileName}`);
    else return res.json({ success: false, err });
  });

  const qs = new Question({
    askedBy: user,
    question,
    attachment: `/public/${newFileName}`
  });
  qs.save();
  return res.json({
    success: true,
    loadedFileName: newFileName,
    message: "File Uploaded."
  });
});

module.exports = router;
