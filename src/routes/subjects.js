const { Router } = require("express")
const { createSubject, deleteSubject, getSubjects, updateSubject } = require("../handlers/subjects.js");
const dbMiddleware = require('../middlewares/dbMiddleware.js');
const { validateSchema } = require("../middlewares/validationMiddleware.js");
const { subjectSchema, updateSubjectSchema } = require("../schemas/subjectSchema.js");
const { idSchema } = require("../schemas/idSchema.js");

const router = Router();

router.use('/', dbMiddleware(process.env.NODE_ENV === 'test' ? 'testSubjects' : 'subjects'));

router.post('/', validateSchema(subjectSchema), createSubject)
router.delete('/:id', validateSchema(idSchema, 'params'), deleteSubject)
router.get('/', getSubjects)
router.put('/:id', validateSchema(idSchema, 'params'), validateSchema(updateSubjectSchema), updateSubject)

module.exports = router;