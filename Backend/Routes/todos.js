const express = require("express");
const router = express.Router();
const todosControllers = require("../Controllers/todos");
const auth = todosControllers.authenticateToken;

router.get("/:id", auth, todosControllers.getByID);
router.get("/", auth, todosControllers.getAll);
router.post("/", auth, todosControllers.create);
router.put("/:id", auth, todosControllers.updateById);
router.delete("/:id", auth, todosControllers.deleteById);

module.exports = router;
