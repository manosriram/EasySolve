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

router.delete("/deleteAnswer", async (req, res) => {
  const { aID, qID } = req.body;
  Question.findOne({ _id: qID })
    .then(question => {
      let op = [];
      question.answer = question.answer.filter((q, qID) => {
        return q._id != aID;
      });
      question.save();
      return res.json({ success: true });
    })
    .catch(err => console.log(err));
});

router.delete("/deleteQuestion", async (req, res) => {
  const { qID } = req.body;
  Question.deleteOne({ _id: qID })
    .then(() => {
      return res.json({ success: true });
    })
    .catch(err => console.log(err));
});

router.post("/answerQuestion", async (req, res) => {
  const { answer, username, questionID, adEmail } = req.body;
  if (!req.files) {
    const an = await Question.findOne({ _id: questionID });
    an.isAnswered = true;
    an.answer.push({
      answeredEmail: adEmail,
      answeredBy: username,
      answerString: answer,
      question_ID: an._id
    });
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
        qs.answer.push({
          answeredEmail: adEmail,
          answeredBy: username,
          answerString: answer,
          question_ID: qs._id,
          attachment: `https://easysolve.s3.ap-south-1.amazonaws.com/${
            params.Key
          }`
        });
        qs.save();
        return res.json({ success: true, message: "Answer submitted." });
      }
    });
  }
});

router.post("/getAllAnswers", async (req, res) => {
  const answ = await Question.findOne({ _id: req.body.qID });
  if (!answ) return res.json({ success: false, message: "No Answers yet." });
  return res.json({ success: true, answers: answ.answer.reverse() });
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
      // questions = questions.sort();
      return res.json({ questions: questions.sort() });
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
