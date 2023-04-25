const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  isTheAnswer: {
    type: Boolean,
    default: false
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'question',
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  comments: [{
    content: String,
    postedAt: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  }]
});

const Answer = mongoose.model('answer', answerSchema);
module.exports = Answer;
