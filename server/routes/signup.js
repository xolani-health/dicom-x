const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

//create, find, update, delete
router.get("/signup", signUpController.signup);
router.post("/signup", signUpController.insert);

module.exports = router;
