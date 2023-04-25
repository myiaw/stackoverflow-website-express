var express = require('express');
var router = express.Router();
var answerController = require('../controllers/answerController.js');
var commentController = require('../controllers/commentController.js');
/*
 * PUT
 */
/*
 * GET show form to answer a question
 */
router.get('/:id/comment', commentController.showAnswerForm);

router.put('/:id', answerController.update);

/*
 * GET
*/
router.get('/', answerController.list);

/*
 * GET
 */
router.get('/:id', answerController.show);

/*
 * POST
 */
router.post('/', answerController.create);

/*
 * DELETE
 */
router.delete('/:id', answerController.remove);



/*
 * POST submit an answer to a question
 */

module.exports = router;
