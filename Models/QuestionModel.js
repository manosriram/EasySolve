const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  askedBy: {
    type: String
  },
  answeredBy: {
    type: String
  },
  question: {
    type: String,
    required: true
  },
  attachment: {
    type: String
  }
});

module.exports = Question = mongoose.model("Questions", QuestionSchema);
