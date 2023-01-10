const express = require("express");
const router = express.Router();
const signInController = require("../controllers/signInController");

//create, find, update, delete
router.get("/", signInController.signin);
router.post("/", signInController.auth);

module.exports = router;
