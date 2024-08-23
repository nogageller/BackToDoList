const { Router } = require("express")
const { createTask, deleteTask, getTasks, updateTask } = require("../handlers/tasks.js");
const { validateTask, validateUpdateTask } = require('../middlewares/taskValidationMiddleware.js');
const { validateId } = require('../middlewares/idValidationMiddleware.js');
const dbMiddleware = require('../middlewares/dbMiddleware.js');

const router = Router();

router.use('/', dbMiddleware(process.env.NODE_ENV === 'test' ? 'testTasks' : 'tasks'));

router.post('/', validateTask, createTask)
router.delete('/:id', validateId, deleteTask)
router.get('/', getTasks)
router.put('/:id', validateId, validateUpdateTask, updateTask)

module.exports = router;