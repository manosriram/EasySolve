const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  askedBy: {
    type: String
  },
  question: {
    type: String
  },
  attachment: {
    type: String
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  askedOn: {
    type: Date,
    default: Date.now()
  },
  answer: [
    {
      answeredBy: { type: String },
      answeredEmail: { type: String },
      answerString: { type: String },
      attachment: { type: String },
      question_ID: { type: String }
    }
  ]
});

module.exports = Question = mongoose.model("Questions", QuestionSchema);
