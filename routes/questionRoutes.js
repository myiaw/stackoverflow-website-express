var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');
var answerController = require('../controllers/answerController.js');

/*
 * GET
 */

router.get('/search', questionController.search)


router.get('/', questionController.list);

// Show the form to create a new question
router.get('/publish', questionController.showPublish);

router.get('/:id/answer', answerController.showAnswerForm);
router.post('/:id/answer', answerController.submitAnswer);

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