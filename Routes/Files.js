const express = require("express");
const router = express.Router();

router.post("/addQuestion", async (req, res) => {
  const { question, attachment, user } = req.body.data;
  console.log(req.body);
  console.log(question);
  console.log(attachment);
  console.log(user);
});

module.exports = router;
