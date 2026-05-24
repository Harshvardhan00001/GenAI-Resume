const pdfParse=require("pdf-parse")

const generateInterviewReport=require('../services/ai.service')
const interviewReportModel=require('../models/interview,model')


async function generateInterviewReportcontroller(req,res){

const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
      const {selfDescription,jobDescription}=req.body
      const interviewAI=await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
      })

      const interviewReport =await interviewReportModel.create({

        user:req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewAI


      })

      res.status(201).json({
        message:'interview report generate success',
        interviewReport
      })
}

module.exports={generateInterviewReportcontroller}