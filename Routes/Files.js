const express = require("express");
const router = express.Router();
const Question = require("../Models/QuestionModel");
const path = require("path");
const AWS = require("aws-sdk");

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

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
    const s3 = new AWS.S3();
    const file = req.files.image.data;
    const params = {
      Bucket: "easysolve",
      Key: `answers/${username}-${Date.now().toString()}`,
      ACL: "public-read",
      Body: file
    };

    s3.putObject(params, async (err, data) => {
      if (err) {
        return res.json({ success: false, message: "Error uploading file.." });
      } else {
        const qs = await Question.findOne({ _id: questionID });
        qs.isAnswered = true;
        qs.answeredBy = username;
        qs.answer = {
          answerString: answer,
          attachment: `https://easysolve.s3.ap-south-1.amazonaws.com/${
            params.Key
          }`
        };
        qs.save();
        return res.json({ success: true, message: "Answer submitted." });
      }
    });
  }
});

router.get("/getNotAnswered", async (req, res) => {
  Question.find({ isAnswered: false })
    .then(questions => {
      return res.json({ questions: questions.reverse() });
    })
    .catch(err => console.log(err));
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

  return res.json({ questions: qs.reverse() });
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

  const { question, user } = req.body;
  const s3 = new AWS.S3();
  const file = req.files.image.data;
  const params = {
    Bucket: "easysolve",
    Key: `questions/${user}-${Date.now().toString()}`,
    ACL: "public-read",
    Body: file
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Error uploading file.."
      });
    } else {
      const qs = new Question({
        askedBy: user,
        question,
        attachment: `https://easysolve.s3.ap-south-1.amazonaws.com/${
          params.Key
        }`,
        isAnswered: false
      });
      qs.save();
      return res.json({
        success: true,
        message: "File Uploaded Succesfully !"
      });
    }
  });
});

module.exports = router;
