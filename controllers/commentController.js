var CommentModel = require('../models/commentModel.js');
var Answer = require('../models/answerModel.js');
var Question = require('../models/questionModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * commentController.list()
     */
    list: function (req, res) {
        CommentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            return res.json(comments);
        });
    },

    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            return res.json(comment);
        });
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {
        var comment = new CommentModel({
			content : req.body.content,
			postedBy : req.body.postedBy
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }

            return res.status(201).json(comment);
        });
    },

    /**
     * commentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            comment.content = req.body.content ? req.body.content : comment.content;
			comment.postedBy = req.body.postedBy ? req.body.postedBy : comment.postedBy;
			
            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }

                return res.json(comment);
            });
        });
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comment.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
    showQuestionForm: function(req, res) {
    const commentId = req.params.id;
    console.log(commentId);
    res.render('comment/publishToQuestion', { commentId: req.params.id });
    },
    showAnswerForm: function(req, res) {
    const commentId = req.params.id;
    console.log(commentId);
    res.render('comment/publishToAnswer', { commentId: req.params.id });
    },
    submitComment: function(req, res, modelType) {
        const parentId = req.params.id;
        const commentData = {
          content: req.body.content,
          postedAt: new Date(),
          postedBy: req.session.userId
        };
      
        const Model = modelType === 'question' ? Question : Answer;
      
        Model.findById(parentId, function(err, parent) {
          if (err) {
            return res.status(500).json({
              message: `Error when finding ${modelType}.`,
              error: err
            });
          }
          if (!parent) {
            return res.status(404).json({
              message: `${modelType} not found.`
            });
          }
      
          parent.comments.push(commentData);
      
          parent.save(function(err, savedParent) {
            if (err) {
              return res.status(500).json({
                message: `Error when submitting comment to ${modelType}.`,
                error: err
              });
            }
    
            if (modelType === 'question') {
              return res.redirect(`/questions/${parentId}`);
            } else {
              return res.redirect(`/questions/`);
            }
          });
        });
      }

      
};
