const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');
module.exports = {

  /**
   * questionController.list()
   */
  list: function (req, res) {
    Question.find()
      .populate('userId', 'username')
      .exec(function (err, questions) {
        if (err) {
          console.log(err); // Add this line for logging
          return res.status(500).json({
            message: 'Error when getting questions.',
            error: err
          });
        }
        const data = {
          questions: questions
        };
        return res.render('question/list', data);
      });
  },


  /**
   * questionController.show()
   */
  show: function (req, res) {
    const id = req.params.id;

    Question.findById(id)
      .populate('userId', 'username')
      .exec(function (err, question) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting question.',
            error: err
          });
        }

        if (!question) {
          return res.status(404).json({
            message: 'Question not found.'
          });
        }

        return res.json(question);
      });
  },

  /**
   * questionController.create()
   */
  create: function (req, res) {
    console.log(req.session.userId);
    const question = new Question({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      createdAt: Date.now(),
      userId: req.session.userId,
      postedBy: req.session.userId
    });

    question.save(function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating question.',
          error: err
        });
      }

      return res.redirect('/users/profile');
    });
  },

  /**
   * questionController.update()
   */
  update: function (req, res) {
    const id = req.params.id;

    Question.findById(id, function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting question.',
          error: err
        });
      }

      if (!question) {
        return res.status(404).json({
          message: 'Question not found.'
        });
      }

      question.title = req.body.title ? req.body.title : question.title;
      question.description = req.body.description ? req.body.description : question.description;
      question.tags = req.body.tags ? req.body.tags.split(',') : question.tags;

      question.save(function (err, question) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating question.',
            error: err
          });
        }

        return res.json(question);
      });
    });
  },

  /**
   * questionController.remove()
   */
  /**
 * questionController.remove()
 */
remove: function (req, res) {
  const questionId = req.params.id;

  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.status(401).send('You must be logged in to delete a question');
  }

  Question.findById(questionId, function (err, question) {
    console.log(req.session.userId);
    console.log(question.userId.toString());
    if (err) {
      return res.status(500).send(err);
    }
    if (question.userId && question.userId.toString() !== req.session.userId) {
      return res.status(403).send('You are not authorized to delete this question');
    }

    Question.findByIdAndRemove(questionId, function (err, question) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(question);
      }
    });
  });
},

  showPublish: function (req, res) {
    res.render('question/publish');
  },

  // Show a question page.

  showPage: function (req, res) {
    const id = req.params.id;
    console.log(id);
  
    Question.findById(id)
      .populate('userId', 'username')
      .populate('postedBy', 'username')
      .populate({
        path: 'answers',
        populate: {
          path: 'postedBy',
          model: 'user',
          select: 'username'
        }
      })
      .exec(function (err, question) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting question.',
            error: err
          });
        }
  
        if (!question) {
          return res.status(404).json({
            message: 'Question not found.'
          });
        }
  
        console.log(question);
  
        const data = {
          question: question
        };
  
        return res.render('question/post', data);
      });
  },
  search: function (req, res) {
    console.log("in search");
    const searchQuery = req.query.tag;
    console.log(searchQuery);
    Question.find({ tags: searchQuery })
      .populate('userId', 'email')
      .exec((err, questions) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        if (questions.length === 0) {
          return res.render('no-results');
        } else {
          return res.render('question/list', { questions, searchQuery });
                }
      });
  }

  
  
  
};
