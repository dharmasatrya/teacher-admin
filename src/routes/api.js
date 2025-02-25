const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

// Register students to a teacher
router.post("/register", teacherController.registerStudents);

// Get common students
router.get("/commonstudents", teacherController.getCommonStudents);

// Suspend a student
router.post("/suspend", teacherController.suspendStudent);

// Retrieve students for notifications
router.post("/retrievefornotifications", teacherController.getNotificationRecipients);

module.exports = router;
