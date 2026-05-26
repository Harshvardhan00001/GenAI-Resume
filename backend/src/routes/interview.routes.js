const express = require("express")
const interviewRouter = express.Router()
const interviewController = require('../controllers/interview.controller')
const upload = require('../middleware/file.middleware')
const authMiddleware = require('../middleware/auth.middleware')

// Generate Plan
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportcontroller)

// Fetch All Plans (Fixes frontend dashboard list error)
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

// Fetch Single Plan Details
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

// Generate PDF
interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter