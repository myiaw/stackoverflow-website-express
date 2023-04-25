var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');



/*
 * GET
 */

router.get('/', commentController.list);

/*
 * GET
 */
router.get('/:id', commentController.show);

/*
 * POST
 */
router.post('/', commentController.create);

/*
 * PUT
 */
router.put('/:id', commentController.update);

/*
 * DELETE
 */
router.delete('/:id', commentController.remove);


module.exports = router;
