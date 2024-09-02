const { Router } = require("express")
const { createTask, deleteTask, getTasks, updateTask } = require("../handlers/tasks.js");
const { validateSchema } = require("../middlewares/validationMiddleware.js");
const { taskSchema, updateTaskSchema } = require("../schemas/tasksSchema.js");
const { idSchema } = require("../schemas/idSchema.js");

const router = Router();

router.post('/', validateSchema(taskSchema), createTask)
router.delete('/:id', validateSchema(idSchema, 'params'), deleteTask)
router.get('/', getTasks)
router.put('/:id', validateSchema(idSchema, 'params'), validateSchema(updateTaskSchema), updateTask)
router.patch('/:id', validateSchema(idSchema, 'params'), validateSchema(updateTaskSchema), updateTask)

module.exports = router;