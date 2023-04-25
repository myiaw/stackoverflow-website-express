const Answer = require('../models/answerModel');
const Question = require('../models/questionModel.js');
console.log(Answer);

module.exports = {
  list: function (req, res) {
    Answer.find(function (err, answers) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting answers.',
          error: err
        });
      }

      return res.json(answers);
    });
  },

  show: function (req, res) {
    var id = req.params.id;

    Answer.findOne({_id: id}, function (err, answers) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting answers.',
          error: err
        });
      }

      if (!answers) {
        return res.status(404).json({
          message: 'No such answers'
        });
      }

      return res.json(answers);
    });
  },


  create: function (req, res) {
    const id = req.params.id;
  
    const answer = new Answer({
      content: req.body.content,
      postedAt: Date.now(),
      questionId: id,
      postedBy: req.session.userId,
      isTheAnswer: false,
      userId: req.session.userId
    });
  
    answer.save(function (err, answer) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating answer.',
          error: err
        });
      }
  
      Question.findByIdAndUpdate(id, {
        $push: {
          answers: answer._id
        }
      }, {
        new: true
      }, function (err, question) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating question.',
            error: err
          });
        }
  
        return res.redirect(`/questions/${id}`);
      });
    });
  },
  
  update: function(req, res) {
    console.log('Request body:'+ req.body.idPostedBy.toString())
    console.log('Session:'+ req.session.userId)
  
    if (req.body.idPostedBy.toString() !== req.session.userId.toString()) {
      res.status(403).send('Unauthorized');
      return;
    } 
    console.log('Request params:'+ req.params.id)
    Answer.findByIdAndUpdate(req.params.id, { $set: { isTheAnswer: true } }, { new: true }, function(err, answer) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log('Answer updated');
        res.status(200).send("answer updated");       
      }
    });
  },
  remove: function (req, res) {
    const answerId = req.params.id;
    
    // Check if the user is authenticated
    if (!req.session.userId) {
      return res.status(401).send('You must be logged in to delete an answer');
    }
  
    Answer.findById(answerId, function (err, answer) {
      console.log(req.session.userId)
      console.log(answer.postedBy.toString())
      if (err) {
        return res.status(500).send(err);
      }
      if (answer.postedBy && answer.postedBy.toString() !== req.session.userId) {
        return res.status(403).send('You are not authorized to delete this answer');
      }
  
      Answer.findByIdAndRemove(answerId, function (err, answer) {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(answer);
        }
      });
    });
  },

  showAnswerForm: function(req, res) {
    console.log('showAnswerForm')
    const questionId = req.params.id;
    console.log(questionId);
    res.render('answer/publish', { questionId: req.params.id });
},

    
submitAnswer: function(req, res) {
  const questionId = req.params.id;
  const answerData = {
    content: req.body.content,
    postedAt: new Date(),
    isTheAnswer: false,
    questionId: questionId,
    postedBy: req.session.userId,
    userId: req.session.userId
  };

  console.log('Answer data:', answerData);

  const answer = new Answer(answerData);

  answer.save(function(err, savedAnswer) {
    if (err) {
      return res.status(500).json({
        message: 'Error when submitting answer.',
        error: err
      });
    }

    Question.findByIdAndUpdate(questionId, {
      $push: {
        answers: savedAnswer._id
      }
    }, {
      new: true
    }, function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when updating question.',
          error: err
        });
      }

      return res.redirect(`/questions/${questionId}`);
    });
  });
}


  
};