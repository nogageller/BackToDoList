const { Router } = require("express")
const { validateId } = require('../middlewares/idValidationMiddleware.js');
const { validateSubject } = require('../middlewares/subjectValidationMiddleware.js');
const { createSubject, deleteSubject, getSubjects, updateSubject } = require("../handlers/subjects");
const dbMiddleware = require('../middlewares/dbMiddleware.js');

const router = Router();

router.use('/', dbMiddleware('subjects'));

router.post('/', validateSubject, createSubject)
router.delete('/:id', validateId, deleteSubject)
router.get('/', getSubjects)
router.put('/:id', validateId, validateSubject, updateSubject)

module.exports = router;