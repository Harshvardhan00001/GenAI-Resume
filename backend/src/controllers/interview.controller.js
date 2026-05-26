const pdfParse = require("pdf-parse")
const PDFDocument = require("pdfkit")
// ✅ Fixed: Added curly braces to destructure the function from the service
const { generateInterviewReport } = require('../services/ai.service')
const interviewReportModel = require('../models/interview,model')

async function generateInterviewReportcontroller(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body
        let parsedResumeText = ""

        if (req.file) {
            const resumeContent = await pdfParse(req.file.buffer)
            parsedResumeText = resumeContent.text
        }

        // 1. Call AI Service
        const interviewAI = await generateInterviewReport({
            resume: parsedResumeText,
            selfDescription,
            jobDescription
        })

        // 💡 Debug: Log this to your terminal to check the incoming keys!
        console.log("=== AI RESPONSE DATA ===", interviewAI);

        // 2. Map fields explicitly to handle naming differences (camelCase vs snake_case)
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: parsedResumeText,
            selfDescription,
            jobDescription,
            title: req.body.title || interviewAI?.title || "Interview Analysis Report",
            
            // Checking common key variants returned by AI models
            technicalQuestions: interviewAI?.technicalQuestions || interviewAI?.technical_questions || [],
            behavioralQuestions: interviewAI?.behavioralQuestions || interviewAI?.behavioral_questions || [],
            skillGaps: interviewAI?.skillGaps || interviewAI?.skill_gaps || [],
            preparationPlan: interviewAI?.preparationPlan || interviewAI?.preparation_plan || [],
            matchScore: interviewAI?.matchScore || interviewAI?.match_score || 0
        })

        return res.status(201).json({
            message: 'interview report generate success',
            interviewReport
        })

    } catch (error) {
        console.error("Controller Error:", error)
        return res.status(500).json({ message: "Internal server error execution tracking path failed." })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found " })
        }

        return res.status(200).json({
            message: "interview report fetched successfully ",
            interviewReport
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.send(pdfBuffer)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    generateInterviewReportcontroller,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}