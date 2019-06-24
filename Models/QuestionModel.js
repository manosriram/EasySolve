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
  questionStatus: {
    type: Boolean
  },
  askedOn: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Question = mongoose.model("Questions", QuestionSchema);
