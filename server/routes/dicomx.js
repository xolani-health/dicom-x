const express = require("express");
const router = express.Router();
const dicomX = require("../controllers/dicomxController");

//create, find, update, delete
router.get("/dicom-x", dicomX.find);
router.post("/dicom-x", dicomX.insert);
router.get("/logout", dicomX.logout);
router.post("/schedule-meeting", dicomX.schedule);
router.post("/update-profile", dicomX.updateProfile);

module.exports = router;
