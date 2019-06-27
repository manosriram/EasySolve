const express = require("express");
const router = express.Router();
const Question = require("../Models/QuestionModel");
const multer = require("multer");
const path = require("path");

router.post("/answerQuestion", async (req, res) => {
  const { answer, username, questionID } = req.body;
  if (!req.files) {
    const an = await Question.findOne({ _id: questionID });
    an.isAnswered = true;
    an.answeredBy = username;
    an.answer = {
      answerString: answer
    };
    an.save();
    return res.json({ success: true, message: "Answer submitted." });
  } else {
    const fl = req.files.imageFile;
    let newFileName = Date.now() + fl.name;

    fl.mv(`${__dirname}/../public/answers/${newFileName}`, err => {
      if (!err) console.log(`Uploaded ${newFileName}`);
      else return res.json({ success: false, err });
    });

    const qs = await Question.findOne({ _id: questionID });
    qs.isAnswered = true;
    qs.answeredBy = username;
    qs.answer = {
      answerString: answer,
      attachment: `/public/answers/${newFileName}`
    };
    qs.save();
    return res.json({ success: true, message: "Answer submitted." });
  }
});

router.get("/getAllQuestions", async (req, res) => {
  Question.find()
    .then(questions => {
      return res.json({ questions });
    })
    .catch(err => console.log(err));
});

router.post("/getUserQuestions", async (req, res) => {
  const { user } = req.body;

  const qs = await Question.find({ askedBy: user });
  // ConstantSourceNode

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

  fl.mv(`${__dirname}/../public/questions/${newFileName}`, err => {
    if (!err) console.log(`Uploaded ${newFileName}`);
    else return res.json({ success: false, err });
  });

  const qs = new Question({
    askedBy: user,
    question,
    attachment: `/public/questions/${newFileName}`,
    isAnswered: false
  });
  qs.save();
  return res.json({
    success: true,
    loadedFileName: newFileName,
    message: "File Uploaded."
  });
});

module.exports = router;
