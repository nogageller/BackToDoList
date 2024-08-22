const { Router } = require("express")
const tasksRouter = require("./tasks.js")
const subjectsRouter = require("./subjects.js")

const router = Router();

router.use("/tasks", tasksRouter)
router.use("/subjects", subjectsRouter)

module.exports = router;