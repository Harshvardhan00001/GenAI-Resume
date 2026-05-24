
const { GoogleGenAI } = require("@google/genai");
const {z}=require('zod')
const {zodToJsonSchema }=require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number()
        .describe("A score between 0 to 100 indicating how well the candidate matches the job description."),
    
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A technical question likely to be asked in the interview."),
        intention: z.string().describe("The interviewer's goal behind asking this question."),
        answer: z.string().describe("Key points and approach to answer this question effectively.")
    })).describe("5-7 technical interview questions relevant to the job and candidate profile."),
    
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A behavioral or situational interview question."),
        intention: z.string().describe("The core competency or trait the interviewer is assessing."),
        answer: z.string().describe("Key points and STAR framework elements to include in the response.")
    })).describe("4-5 behavioral interview questions with evaluation insights."),
    
    skillGaps: z.array(z.object({
        skill: z.string().describe("A technical skill or concept where a gap was identified."),
        severity: z.enum(['low', 'medium', 'high'])
            .describe("Criticality of this gap: low = nice to have, medium = important, high = blocking.")
    })).describe("Missing or weak skills compared to the job requirements."),
    
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number (e.g., 1, 2, 3)."),
        focus: z.string().describe("The primary topic or skill to work on this day."),
        tasks: z.array(z.string()).describe("Concrete actionable tasks to complete on this day.")
    })).describe("A structured day-by-day preparation roadmap to bridge skill gaps before the interview.")
});

async function generateInterviewReport({resume,selfDescription,jobDescription}) {
 
    const prompt=`generate an interview report for a candidate with the details:
    Resume:${resume}
    Self Description:${selfDescription}
    Job Description:${jobDescription}
    
    `


    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
             responseSchema: zodToJsonSchema(interviewReportSchema, {
                $refStrategy: "none",    
                target: "jsonSchema7"    
            })
        }

    })
   return  JSON.parse(response.text)
   
}


module.exports = generateInterviewReport;