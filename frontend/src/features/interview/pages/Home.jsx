import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports = [] } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [fileName, setFileName] = useState("") 
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]  // ✅ Fixed: added [0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.")
                if (resumeInputRef.current) resumeInputRef.current.value = ""
                setFileName("")
                return
            }
            setFileName(file.name)
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            alert("Please enter a target job description.")
            return
        }
        if (!selfDescription.trim() && !resumeInputRef.current?.files?.[0]) {  // ✅ Fixed: added [0]
            alert("Please upload a resume or provide a quick self-description.")
            return
        }

        const resumeFile = resumeInputRef.current?.files?.[0] || null  // ✅ Fixed: added [0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <h1 className="text-red-500 font-bold animate-pulse">
                    Loading your interview plan...
                </h1>
            </main>
        )
    }

    return (
        <div className="min-h-screen bg-black text-zinc-200 p-6 flex flex-col gap-8">

            {/* Page Header */}
            <header className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Create Your Custom <span className="text-red-500">Interview Plan</span>
                </h1>
                <p className="text-zinc-400 mt-2">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {/* Main Card */}
            <div className="w-full max-w-6xl mx-auto bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg shadow-red-900/30 p-6 flex flex-col md:flex-row gap-6">

                {/* Left Panel - Job Description */}
                <div className="flex-1 flex flex-col gap-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        Target Job Description
                        <span className="ml-2 text-red-500 text-[10px]">Required</span>
                    </label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        maxLength={5000}
                        className="w-full min-h-[250px] p-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-zinc-200 placeholder-zinc-600 resize-y"
                    />
                    <div className="text-[10px] text-zinc-500">{jobDescription.length} / 5000 chars</div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-zinc-800"></div>

                {/* Right Panel - Profile */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Upload Resume */}
                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                            Upload Resume
                            <span className="ml-2 text-red-500 text-[10px]">Best Results</span>
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition">
                            <p className="text-xs text-zinc-400">
                                <span className="font-semibold text-red-500">
                                    {fileName || 'Click to upload'}
                                </span> {!fileName && 'or drag & drop'}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">PDF or DOCX (Max 5MB)</p>
                            <input 
                                ref={resumeInputRef} 
                                onChange={handleFileChange}
                                type="file" 
                                id="resume" 
                                name="resume" 
                                accept=".pdf,.docx" 
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center text-[10px] text-zinc-500">
                        <div className="flex-1 h-px bg-zinc-800"></div>
                        <span className="px-2">OR</span>
                        <div className="flex-1 h-px bg-zinc-800"></div>
                    </div>

                    {/* Self Description */}
                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                            Quick Self-Description
                        </label>
                        <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            placeholder="Briefly describe your experience, key skills, and goals..."
                            className="w-full h-[120px] p-4 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm text-zinc-200 placeholder-zinc-600 resize-y"
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[12px] text-zinc-400 flex items-start gap-2">
                        <span className="text-red-500">ℹ️</span>
                        <p>Either a <strong className="text-white">Resume</strong> or a <strong className="text-white">Self Description</strong> is required.</p>
                    </div>
                </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleGenerateReport}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-6 rounded-lg shadow-md shadow-red-900/40 uppercase tracking-wider transition-colors"
                >
                    Generate My Interview Strategy
                </button>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <section className="w-full max-w-6xl mx-auto mt-8">
                    <h2 className="text-lg font-bold text-white mb-4">My Recent Interview Plans</h2>
                    <ul className="space-y-3">
                        {reports.map(report => (
                            <li
                                key={report._id}
                                onClick={() => navigate(`/interview/${report._id}`)}
                                className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer hover:border-red-600 transition"
                            >
                                <h3 className="text-white font-semibold">{report.title || 'Untitled Position'}</h3>
                                <p className="text-xs text-zinc-500">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-red-500">Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className="mt-12 flex justify-center gap-6 text-xs text-zinc-500">
                <a href="#" className="hover:text-red-500">Privacy Policy</a>
                <a href="#" className="hover:text-red-500">Terms of Service</a>
                <a href="#" className="hover:text-red-500">Help Center</a>
            </footer>
        </div>
    )
}

export default Home