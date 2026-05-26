import React, { useState, useEffect } from 'react'
import { useInterview } from "../hooks/useInterview.js";
import { useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden transition-all hover:border-zinc-800">
            <div 
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-zinc-900/10 hover:bg-zinc-900/40 transition-colors" 
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-red-500 mt-0.5">[{String(index + 1).padStart(2, '0')}]</span>
                    <p className="text-sm font-medium text-zinc-200 leading-relaxed">{item.question}</p>
                </div>
                <span className={`text-zinc-500 transition-transform duration-200 shrink-0 ${open ? 'rotate-180 text-red-500' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className="p-4 border-t border-zinc-900 bg-black/40 space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">Intention</span>
                        <p className="text-xs text-zinc-400 leading-relaxed pl-1">{item.intention}</p>
                    </div>
                    <div className="space-y-1.5">
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-red-950/30 text-red-400 border border-red-900/30">Model Answer</span>
                        <p className="text-xs text-zinc-300 leading-relaxed pl-1">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-red-600 text-white rounded-md tracking-wide">Day {day.day}</span>
            <h3 className="text-sm font-bold text-zinc-200">{day.focus}</h3>
        </div>
        <ul className="space-y-2 pl-1">
            {day.tasks.map((task, i) => (
                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2.5 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600/70 mt-1.5 shrink-0" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center font-sans antialiased">
                <h1 className="text-sm font-mono font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-3 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    Loading your interview plan...
                </h1>
            </main>
        );
    }

    const ringColor =
        report.matchScore >= 80 ? 'text-red-500 border-red-600/30 shadow-red-950/20' :
        report.matchScore >= 60 ? 'text-amber-500 border-amber-600/30 shadow-amber-950/20' : 'text-zinc-500 border-zinc-800'

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased selection:bg-red-600 selection:text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden min-h-[600px]">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* ── Left Nav ── */}
                <nav className="w-full md:w-64 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 shrink-0 bg-zinc-950/50 z-10">
                    <div className="space-y-4 w-full">
                        <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2">Sections</p>
                        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 md:w-full ${
                                        activeNav === item.id 
                                            ? 'bg-zinc-900 text-red-500 border border-zinc-800 font-semibold' 
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
                                    }`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className={`${activeNav === item.id ? 'text-red-500' : 'text-zinc-500'}`}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="mt-6 md:mt-0 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-950/40 active:scale-[0.99]"
                    >
                        <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                {/* ── Center Content ── */}
                <main className="flex-1 p-5 md:p-6 lg:p-8 overflow-y-auto z-10">
                    {activeNav === 'technical' && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                <h2 className="text-base font-bold text-zinc-100 tracking-wide">Technical Questions</h2>
                                <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full">{(report.technicalQuestions || []).length} Questions</span>
                            </div>
                            <div className="space-y-3">
                                {(report.technicalQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                <h2 className="text-base font-bold text-zinc-100 tracking-wide">Behavioral Questions</h2>
                                <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full">{(report.behavioralQuestions || []).length} Questions</span>
                            </div>
                            <div className="space-y-3">
                                {(report.behavioralQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                                <h2 className="text-base font-bold text-zinc-100 tracking-wide">Preparation Road Map</h2>
                                <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full">{(report.preparationPlan || []).length}-Day Plan</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {(report.preparationPlan || []).map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className="w-full md:w-64 p-5 md:p-6 border-t md:border-t-0 md:border-l border-zinc-900 shrink-0 bg-zinc-950/40 space-y-6 z-10 flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Match Score Display */}
                        <div className="text-center md:text-left space-y-2 bg-zinc-900/10 p-4 border border-zinc-900/60 rounded-xl">
                            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Match Score</p>
                            <div className="flex justify-center md:justify-start items-baseline gap-1">
                                <span className={`text-5xl font-black tracking-tighter ${ringColor}`}>{report.matchScore || 0}</span>
                                <span className="text-sm font-bold text-zinc-500">%</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-normal pt-1 border-t border-zinc-900/40">Strong matrix fitment baseline metrics mapping.</p>
                        </div>

                        <div className="h-px bg-zinc-900 w-full" />

                        {/* Enhanced Wrapping Skill Gaps UI */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Skill Gaps</p>
                                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    {(report.skillGaps || []).length} Identified
                                </span>
                            </div>

                            {(!report.skillGaps || report.skillGaps.length === 0) ? (
                                <div className="p-4 rounded-xl border border-dashed border-zinc-800/60 text-center bg-zinc-900/5">
                                    <p className="text-xs text-zinc-500 font-medium">No critical gaps detected!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {report.skillGaps.map((gap, i) => {
                                        const targetSkill = gap.skill || gap.name || JSON.stringify(gap);
                                        const targetSeverity = gap.severity || "medium";

                                        const isHigh = targetSeverity.toLowerCase() === 'high';
                                        const isMedium = targetSeverity.toLowerCase() === 'medium' || targetSeverity.toLowerCase() === 'mid';

                                        const cardStyle = isHigh 
                                            ? 'bg-red-950/20 text-red-200 border-red-900/30 hover:border-red-800/40' 
                                            : isMedium 
                                            ? 'bg-amber-950/15 text-amber-200 border-amber-900/20 hover:border-amber-800/40' 
                                            : 'bg-zinc-900/30 text-zinc-300 border-zinc-900 hover:border-zinc-800'

                                        const dotStyle = isHigh ? 'bg-red-500 shadow-red-500/50' : isMedium ? 'bg-amber-500 shadow-amber-500/50' : 'bg-zinc-500'
                                        const badgeStyle = isHigh ? 'bg-red-950/60 text-red-400 border-red-900/40' : isMedium ? 'bg-amber-950/60 text-amber-400 border-amber-900/40' : 'bg-zinc-900 text-zinc-500 border-zinc-800'

                                        return (
                                            <div 
                                                key={i} 
                                                className={`group flex items-start justify-between p-2.5 rounded-xl border gap-3 transition-all duration-200 ${cardStyle}`}
                                            >
                                                <div className="flex items-start gap-2.5 min-w-0 pt-0.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 shadow-sm mt-1.5 transition-transform group-hover:scale-125 ${dotStyle}`} />
                                                    <span className="text-xs font-semibold tracking-wide break-words whitespace-normal text-zinc-200">
                                                        {targetSkill}
                                                    </span>
                                                </div>
                                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 select-none mt-0.5 ${badgeStyle}`}>
                                                    {targetSeverity}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="pt-4 text-[10px] font-mono text-zinc-600 text-center md:text-left">
                        System Node ID: {report._id ? (typeof report._id === 'string' ? report._id.substring(18) : report._id.$oid?.substring(18)) : "N/A"}
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview