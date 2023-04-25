const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  isAnswered: {
    type: Boolean,
    default: false,
    required: true
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'answer',
    required: false
  }]
});

module.exports = mongoose.model('question', questionSchema);
