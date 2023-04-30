const express = require("express");
const router = express.Router();
const usersControllers = require("../Controllers/users");

router.post("/", usersControllers.register);
router.post("/login", usersControllers.login);

module.exports = router;
