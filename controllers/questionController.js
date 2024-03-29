const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');
const User = require('../models/userModel');
module.exports = {

  /**
   * questionController.list()
   */
  list: function (req, res) {
    Question.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .exec(function (err, questions) {
        if (err) {
          console.log(err);
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

    console.log('Request body:', req.body);

    // Check if tags exist, split by commas and trim whitespace
    const tagsArray = req.body.tags
      ? req.body.tags.split(',').map(tag => tag.trim())
      : [];
  
    const question = new Question({
      title: req.body.title,
      description: req.body.description,
      tags: tagsArray,
      createdAt: Date.now(),
      userId: req.session.userId,
      postedBy: req.session.userId,
      comments: []
    });
  
    question.save(function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating question.',
          error: err
        });
      } else {
        User.findByIdAndUpdate(req.session.userId, { $inc: { questionCount: 1 } }, function (err, user) {
          if (err) {
            return res.status(500).json({
              message: 'Error when updating user.',
              error: err
            });
          }
  
          return res.redirect('/questions');
        })
      }
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
          message: 'Error when getting questiondsa.',
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
            message: 'Error when updating questionasdsasd.',
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
      .populate({
        path: 'postedBy',
        select: 'username image',
      })
      .populate({
        path: 'answers',
        populate: {
          path: 'postedBy',
          model: 'user',
          select: 'username image'
        }
      })
      .sort({ createdAt: -1 })
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
  search: function search(req, res) {
    console.log("in search");
    let searchQuery = req.query.tag;
    let tags = searchQuery.includes(',') ? searchQuery.split(',').map(tag => tag.trim()) : [searchQuery.trim()];
    console.log("Search query:", searchQuery);
    console.log("Tags:", tags);

    Question.find({ tags: { $in: tags } })
      .populate('userId', 'email')
      .exec((err, questions) => {
        if (err) {
          console.log("Error:", err);
          return res.status(500).send(err);
        }
        console.log("Questions:", questions);
        if (questions.length === 0) {
          return res.render('no-results', { searchQuery: searchQuery });
        } else {
          return res.render('question/list', { questions, searchQuery: searchQuery });
        }
      });
  }









};
