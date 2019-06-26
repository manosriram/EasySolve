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
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  askedOn: {
    type: Date,
    default: Date.now()
  },
  answer: { answerString: { type: String }, attachment: { type: String } }
});

module.exports = Question = mongoose.model("Questions", QuestionSchema);
