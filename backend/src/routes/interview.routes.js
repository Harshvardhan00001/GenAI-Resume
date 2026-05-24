const express=require("express")
const interviewRouter=express.Router()
const interviewController=require('../controllers/interview.controller')
const upload=require('../middleware/file.middleware')
const authMiddleware=require('../middleware/auth.middleware')


interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportcontroller)



module.exports=interviewRouter