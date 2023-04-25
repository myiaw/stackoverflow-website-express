var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');
var answerController = require('../controllers/answerController.js');
var commentController = require('../controllers/commentController.js');
/*
 * GET
 */

router.get('/search', questionController.search)


router.get('/', questionController.list);

// Show the form to crea    te a new question
router.get('/publish', questionController.showPublish);

// Answer routes
router.get('/:id/answer', answerController.showAnswerForm);
router.post('/:id/answer', answerController.submitAnswer);

// Comment routes
router.get('/:id/comment', commentController.showQuestionForm);


router.post('/questions/:id/comment', function(req, res) {
    commentController.submitComment(req, res, 'question');
  });
  
  router.post('/answers/:id/comment', function(req, res) {
    commentController.submitComment(req, res, 'answer');
  });
  


/*
 * GET
 */
router.get('/:id', questionController.showPage);

/*
 * POST
 */
router.post('/', questionController.create);

/*
 * PUT
 */
router.put('/:id', questionController.update);

/*
 * DELETE
 */
router.delete('/:id', questionController.remove);


module.exports = router;