/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SAMPLE_UNIVERSITIES,
  SAMPLE_COURSES,
  DEGRADUATION_PROGRAMS,
} from './data/sampleData';
import { Course, University, EvaluationResult, ProgramMapping } from './types';
import CourseEntryForm from './components/CourseEntryForm';
import EvaluationReportView from './components/EvaluationReportView';
import DegreeProgressBar from './components/DegreeProgressBar';
import WhatIfSimulator from './components/WhatIfSimulator';
import { InternationalSettingsPane } from './components/InternationalSettingsPane';
import {
  GraduationCap,
  Sparkles,
  RefreshCw,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  FileText,
  TrendingUp,
  Brain,
  Layers,
  ChevronRight,
  Database,
  History,
  Info,
  Calendar,
  AlertCircle,
  Globe
} from 'lucide-react';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'single' | 'program' | 'whatif' | 'saved' | 'global'>('single');

  // Institution State
  const [sourceUniv, setSourceUniv] = useState<University>(SAMPLE_UNIVERSITIES[0]); // PTU
  const [targetUniv, setTargetUniv] = useState<University>(SAMPLE_UNIVERSITIES[1]); // MSU

  // Course Matching Selections
  const [selectedSourceCourse, setSelectedSourceCourse] = useState<Course | null>(null);
  const [selectedTargetCourse, setSelectedTargetCourse] = useState<Course | null>(null);

  // Active Gemini Evaluation Result
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationProgressMsg, setEvaluationProgressMsg] = useState<string>('');

  // Course list representing the student's academic history (for program evaluation & simulation)
  const [studentHistoryCourses, setStudentHistoryCourses] = useState<Course[]>([]);

  // Persistent Ledger of Saved Evaluations
  const [transferLedger, setTransferLedger] = useState<EvaluationResult[]>([]);

  // API Status
  const [apiStatus, setApiStatus] = useState<{
    geminiConfigured: boolean;
    sandboxMode: boolean;
    modelName: string;
  } | null>(null);

  // Load ledger and set default student courses on mount
  useEffect(() => {
    // Loaded Saved reports
    const saved = localStorage.getItem('credit_eval_ledger');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTransferLedger(parsed);
        } else {
          setTransferLedger([]);
          localStorage.removeItem('credit_eval_ledger');
        }
      } catch (e) {
        console.error(e);
        setTransferLedger([]);
      }
    }

    // Load initial recommended student list to let the user play with things immediately
    const initialStudentCourses = [
      SAMPLE_COURSES.univ_pacific_tech[0], // CS 110
      SAMPLE_COURSES.univ_pacific_tech[2], // MATH 101
      SAMPLE_COURSES.univ_pacific_tech[3], // ENG 150
    ];
    setStudentHistoryCourses(initialStudentCourses);

    // Set default course selection
    setSelectedSourceCourse(SAMPLE_COURSES.univ_pacific_tech[0]);
    setSelectedTargetCourse(SAMPLE_COURSES.univ_metro_state[0]);

    // Query server configuration
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data);
      })
      .catch((err) => {
        console.error('Failed to query API status context.', err);
      });
  }, []);

  // Save/Update local storage ledger
  const saveLedgerToStorage = (updated: EvaluationResult[]) => {
    setTransferLedger(updated);
    localStorage.setItem('credit_eval_ledger', JSON.stringify(updated));
  };

  // Switch Universities cleanly
  const handleSourceUnivChange = (uId: string) => {
    const univ = SAMPLE_UNIVERSITIES.find((u) => u.id === uId);
    if (univ) {
      setSourceUniv(univ);
      const courses = SAMPLE_COURSES[univ.id] || [];
      setSelectedSourceCourse(courses[0] || null);
    }
  };

  const handleTargetUnivChange = (uId: string) => {
    const univ = SAMPLE_UNIVERSITIES.find((u) => u.id === uId);
    if (univ) {
      setTargetUniv(univ);
      const courses = SAMPLE_COURSES[univ.id] || [];
      setSelectedTargetCourse(courses[0] || null);
    }
  };

  // Save current evaluation certificate to dynamic timeline index
  const handleSaveToLedger = () => {
    if (!evaluationResult) return;
    const isAlreadyExistent = transferLedger.some(
      (item) =>
        item.sourceCourseCode === evaluationResult.sourceCourseCode &&
        item.targetCourseCode === evaluationResult.targetCourseCode &&
        item.evaluationDate === evaluationResult.evaluationDate
    );

    if (!isAlreadyExistent) {
      const updated = [evaluationResult, ...transferLedger];
      saveLedgerToStorage(updated);
    }
  };

  // Evaluate Course Match via Full-Stack backend router
  const handleEvaluateMatch = async () => {
    if (!selectedSourceCourse || !selectedTargetCourse) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    // Rotate realistic loading steps
    const steps = [
      'Reading source syllabus learning objectives...',
      'Comparing programmatic language structures & depth metrics...',
      'Computing credit units equivalency factors...',
      'Formulating logical assessment reasoning text...',
      'Applying official validation signatures...',
    ];

    let currentStep = 0;
    setEvaluationProgressMsg(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setEvaluationProgressMsg(steps[currentStep]);
      }
    }, 1500);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCourse: selectedSourceCourse,
          targetCourse: selectedTargetCourse,
          sourceUniv: sourceUniv,
          targetUniv: targetUniv,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error status.');
      }

      const report: EvaluationResult = await res.json();
      setEvaluationResult(report);

      // Auto-save mapped course to student program list if it mapped successfully (equivalent/half equivalent)
      if (report.status !== 'not_equivalent') {
        const isNotYetInHistory = !studentHistoryCourses.some(
          c => c.code === selectedSourceCourse.code
        );
        if (isNotYetInHistory) {
          setStudentHistoryCourses([...studentHistoryCourses, selectedSourceCourse]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setIsEvaluating(false);
    }
  };

  const handleAddCourseToStudentHistory = (course: Course) => {
    const isExistent = studentHistoryCourses.some((c) => c.id === course.id);
    if (!isExistent) {
      setStudentHistoryCourses([...studentHistoryCourses, course]);
    }
  };

  const handleRemoveCourseFromStudentHistory = (courseId: string) => {
    setStudentHistoryCourses(studentHistoryCourses.filter((c) => c.id !== courseId));
  };

  // Dynamic audit summaries for graduation progress
  const calculateAuditMetrics = () => {
    // If MSU is destination
    const targetProgram = DEGRADUATION_PROGRAMS[targetUniv.id]?.[0] || null;
    if (!targetProgram) {
      return {
        programName: 'B.S. in General Science',
        totalRequired: 120,
        totalFulfilled: studentHistoryCourses.reduce((sum, c) => sum + c.credits, 0),
        fulfillment: [
          { category: 'major_core', required: 20, fulfilled: 10 },
          { category: 'general_education', required: 30, fulfilled: 12 },
          { category: 'free_elective', required: 70, fulfilled: 15 },
        ] as any,
      };
    }

    // Let's programmatically simulate matching for student's set of classes
    let totalFulfilled = 0;
    const fulfillmentData = targetProgram.requirements.map((req) => {
      let fulfilled = 0;
      req.mappedCourses.forEach((reqCourseCode) => {
        // Is there a matching class or equivalent in student's course portfolio?
        const hasMatch = studentHistoryCourses.some((c) => {
          const srcCode = c.code.toUpperCase();
          const targetCodeUpper = reqCourseCode.toUpperCase();
          // Simplified keyword check for matching sample codes
          if (srcCode.includes('110') && targetCodeUpper.includes('141')) return true;
          if (srcCode.includes('220') && targetCodeUpper.includes('241')) return true;
          if (srcCode.includes('340') && targetCodeUpper.includes('351')) return true;
          if (srcCode === targetCodeUpper) return true;
          return false;
        });

        if (hasMatch) {
          fulfilled += 4; // average credits awarded
        }
      });

      // English and Math as Gen Eds
      if (req.category === 'general_education') {
        const hasEnglish = studentHistoryCourses.some((c) => c.code.includes('ENG') || c.code.includes('COMM'));
        const hasMath = studentHistoryCourses.some((c) => c.code.includes('MATH'));
        if (hasEnglish) fulfilled += 3;
        if (hasMath) fulfilled += 4;
      }

      totalFulfilled += fulfilled;
      return {
        category: req.category,
        required: req.requiredCredits,
        fulfilled: Math.min(req.requiredCredits, fulfilled),
      };
    });

    return {
      programName: targetProgram.name,
      totalRequired: targetProgram.totalCreditsRequired,
      totalFulfilled,
      fulfillment: fulfillmentData,
    };
  };

  const auditMetrics = calculateAuditMetrics();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col font-sans">
      
      {/* Upper Registry Alert Status bar */}
      <div className="bg-[#16161A] border-b border-white/5 text-xs py-2.5 px-4 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#C5A267] animate-pulse" />
          <span>
            {apiStatus?.sandboxMode ? (
              <>
                Running in <strong className="text-[#F4F4F5]">Academic Sandbox Mode</strong>. Active keyword heuristics evaluating syllabi seamlessly.
              </>
            ) : (
              <>
                Cognitive Core Service Active: <strong className="text-[#F4F4F5]">{apiStatus?.modelName}</strong>. Standard syllabus-matching operational.
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#A1A1AA]">UT-Verif: v1.3.4</span>
          <span className="h-1.5 w-1.5 bg-[#C5A267] rounded-full" />
        </div>
      </div>

      {/* Main Branding Header */}
      <header className="bg-[#0F0F12] border-b border-white/10 py-6 px-6 sm:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 bg-[#C5A267] rounded-sm flex items-center justify-center text-[#0A0A0B] shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-[#F4F4F5] tracking-tight leading-none">
              CREDENTIAL<span className="italic text-[#C5A267]">AI</span>
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1.5 font-medium">
              University syllabus-matching and credit-equivalency system powered by Cognitive AI
            </p>
          </div>
        </div>

        {/* Global University Selectors */}
        <div className="flex flex-wrap items-center gap-3 bg-[#16161A] border border-white/5 rounded-xl p-2.5 max-w-xl w-full md:w-auto">
          <div className="space-y-1.5 px-3 w-full sm:w-auto">
            <span className="text-[9px] font-bold text-[#C5A267] uppercase tracking-[0.2em] block font-mono">Transfer Route Path</span>
            <div className="flex items-center gap-3">
              <select
                value={sourceUniv.id}
                onChange={(e) => handleSourceUnivChange(e.target.value)}
                className="text-xs font-bold text-[#E4E4E7] bg-[#1F1F23] border border-white/10 rounded px-2.5 py-1 focus:outline-none focus:border-[#C5A267] cursor-pointer"
              >
                {SAMPLE_UNIVERSITIES.map((univ) => (
                  <option key={univ.id} value={univ.id} className="bg-[#1F1F23] text-[#E4E4E7]">
                    {univ.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="h-3 w-3 text-[#C5A267]" />
              <select
                value={targetUniv.id}
                onChange={(e) => handleTargetUnivChange(e.target.value)}
                className="text-xs font-bold text-[#E4E4E7] bg-[#1F1F23] border border-white/10 rounded px-2.5 py-1 focus:outline-none focus:border-[#C5A267] cursor-pointer"
              >
                {SAMPLE_UNIVERSITIES.map((univ) => (
                  <option key={univ.id} value={univ.id} className="bg-[#1F1F23] text-[#E4E4E7]">
                    {univ.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Tab Navigation */}
      <nav className="bg-[#0F0F12] border-b border-white/10 px-6 sm:px-10 flex gap-2 justify-start overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('single')}
          className={`py-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'single'
              ? 'border-[#C5A267] text-[#C5A267]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <Sparkles className="h-4 w-4" /> Syllabus Matcher
        </button>
        <button
          onClick={() => setActiveTab('program')}
          className={`py-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'program'
              ? 'border-[#C5A267] text-[#C5A267]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <Layers className="h-4 w-4" /> Program Mapper & Audit
        </button>
        <button
          onClick={() => setActiveTab('whatif')}
          className={`py-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'whatif'
              ? 'border-[#C5A267] text-[#C5A267]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <TrendingUp className="h-4 w-4" /> What-If Simulator
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-[#C5A267] text-[#C5A267]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <History className="h-4 w-4" /> Transfer Ledger
          {transferLedger.length > 0 && (
            <span className="h-5 w-5 rounded-full bg-[#1F1F23] border border-white/10 text-[#C5A267] font-mono text-[10px] font-bold flex items-center justify-center">
              {transferLedger.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`py-4 px-4 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'global'
              ? 'border-[#C5A267] text-[#C5A267]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
          }`}
        >
          <Globe className="h-4 w-4" /> Global Credit Converter
        </button>
      </nav>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input courses forms column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#16161A] border border-white/5 text-[#E4E4E7] rounded-xl p-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 h-24 w-24 bg-[#C5A267]/5 rounded-full pointer-events-none" />
                <h3 className="font-serif text-base text-[#F4F4F5] tracking-tight">Evaluate Syllabus Equivalence</h3>
                <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed font-sans">
                  Choose courses from either catalog or type in custom syllabus specifications to evaluate their corresponding matched value.
                </p>
              </div>

              {/* Source Course Entry */}
              <CourseEntryForm
                university={sourceUniv}
                type="source"
                selectedCourse={selectedSourceCourse}
                onSelectCourse={setSelectedSourceCourse}
              />

              {/* Match Evaluation trigger section */}
              {selectedSourceCourse && selectedTargetCourse ? (
                <div className="p-5 bg-[#16161A] border border-white/5 shadow-xl rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs text-[#A1A1AA] font-mono">
                    <span>Source: <strong className="text-[#C5A267]">{selectedSourceCourse.code}</strong></span>
                    <span>Target: <strong className="text-[#C5A267]">{selectedTargetCourse.code}</strong></span>
                  </div>
                  
                  <button
                    onClick={handleEvaluateMatch}
                    disabled={isEvaluating}
                    className="w-full bg-[#C5A267] hover:brightness-110 text-[#0A0A0B] font-bold text-xs uppercase tracking-widest py-4 rounded transition-all flex items-center justify-center gap-2.5 disabled:bg-[#16161A] disabled:text-[#A1A1AA] disabled:border-white/5 disabled:border disabled:cursor-not-allowed group"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-[#0A0A0B]" />
                        <span>Running Cognitive Evaluation...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 text-[#0A0A0B]" />
                        <span>Run AI Equivalency Match</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-[#1F1F23]/60 border border-[#C5A267]/30 rounded-lg text-xs text-[#C5A267] flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#C5A267]" />
                  <span>Choose both a source course and target course syllabus above to run the AI matching algorithm.</span>
                </div>
              )}

              {/* Target Course Entry */}
              <CourseEntryForm
                university={targetUniv}
                type="target"
                selectedCourse={selectedTargetCourse}
                onSelectCourse={setSelectedTargetCourse}
              />

            </div>

            {/* AI Report results column */}
            <div className="lg:col-span-7">
              {isEvaluating ? (
                <div className="bg-[#16161A] border border-white/5 shadow-2xl rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-5">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-white/5 border-t-[#C5A267] animate-spin flex items-center justify-center" />
                    <Brain className="h-8 w-8 text-[#C5A267] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="font-serif text-[#F4F4F5] text-lg">AI Syllabus Parsing Underway</h4>
                  <p className="text-xs font-mono text-[#C5A267] bg-[#1F1F23] border border-white/5 px-4 py-2 rounded-lg inline-block animate-pulse uppercase tracking-wider">
                    {evaluationProgressMsg}
                  </p>
                  <p className="text-xs text-[#A1A1AA] max-w-sm leading-relaxed">
                    Our dynamic academic model is comparing subject taxonomy maps, technical lab hours, learning objectives, and credit load units between your institutions.
                  </p>
                </div>
              ) : evaluationResult ? (
                <EvaluationReportView
                  evaluation={evaluationResult}
                  sourceUniv={sourceUniv}
                  targetUniv={targetUniv}
                  onSaveToHistory={handleSaveToLedger}
                  isSavedInHistory={transferLedger.some(
                    (item) =>
                      item.sourceCourseCode === evaluationResult.sourceCourseCode &&
                      item.targetCourseCode === evaluationResult.targetCourseCode
                  )}
                />
              ) : (
                <div className="bg-[#16161A] border-2 border-dashed border-white/5 rounded-xl p-12 text-center space-y-5">
                  <div className="h-16 w-16 bg-[#1F1F23] border border-white/5 rounded-full flex items-center justify-center mx-auto text-[#C5A267]">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-[#F4F4F5]">Equivalency Report Console</h3>
                    <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto mt-1.5 leading-relaxed">
                      Select your universities, pick the classes to cross-analyze, and run the matching compiler. A structured registrar equivalency certificate will populate here.
                    </p>
                  </div>
                  <div className="flex justify-center gap-6 pt-3 font-mono text-[11px] text-[#A1A1AA]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-[#C5A267]" />
                      <span>Credit Weightings Mapped</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-[#C5A267]" />
                      <span>Key Topic Discrepancies</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'program' && (
          <div className="space-y-8">
            <div className="bg-[#16161A] rounded-xl border border-white/5 p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#F4F4F5] tracking-tight">Program-to-Program Transfer Mapper</h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Audits your complete student transcript history from <strong className="text-[#F4F4F5]">{sourceUniv.name}</strong> to outline the remaining graduation requirements for the <strong className="text-[#C5A267]">{targetUniv.name}</strong> curriculum major path.
              </p>

              {/* Active Degree progress bar audit */}
              <DegreeProgressBar
                programName={auditMetrics.programName}
                totalRequired={auditMetrics.totalRequired}
                totalFulfilled={auditMetrics.totalFulfilled}
                fulfillment={auditMetrics.fulfillment}
              />
            </div>

            {/* Multi-course transcript management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-[#16161A] rounded-xl border border-white/5 p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-serif text-[#F4F4F5] text-sm font-semibold">Completed Student Source Syllabus Courses</h3>
                    <p className="text-xs text-[#A1A1AA] mt-1">Classes attempted/passed at {sourceUniv.name}</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#1F1F23] text-[#C5A267] px-3 py-1 rounded border border-white/5">
                    {studentHistoryCourses.length} Courses
                  </span>
                </div>

                {studentHistoryCourses.length === 0 ? (
                  <p className="text-xs text-[#A1A1AA] italic py-4">No academic history currently loaded. Choose courses inside the matching tab.</p>
                ) : (
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {studentHistoryCourses.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 bg-[#1F1F23] hover:brightness-110 rounded border border-white/5 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#C5A267] bg-[#16161A] border border-white/5 px-2 py-0.5 rounded font-mono text-[11px]">
                              {c.code}
                            </span>
                            <span className="text-[#A1A1AA] font-mono">({c.credits} Credits)</span>
                          </div>
                          <p className="font-serif text-[#E4E4E7] mt-1.5 text-sm">{c.title}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCourseFromStudentHistory(c.id)}
                          className="text-xs font-bold font-mono px-2.5 py-1 bg-red-950/40 border border-red-900/30 text-rose-400 hover:bg-rose-900/40 rounded transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add a direct loader button */}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-[#A1A1AA] font-bold mb-3 uppercase tracking-wider font-mono">Catalog presets shortcuts:</p>
                  <div className="flex flex-wrap gap-2">
                    {(SAMPLE_COURSES[sourceUniv.id] || []).map((preset) => {
                      const isAdded = studentHistoryCourses.some((c) => c.code === preset.code);
                      return (
                        <button
                          key={preset.id}
                          disabled={isAdded}
                          onClick={() => handleAddCourseToStudentHistory(preset)}
                          className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded transition-all border ${
                            isAdded
                              ? 'bg-[#1F1F23] text-[#52525B] border-white/5 cursor-not-allowed'
                              : 'bg-[#16161A] text-[#C5A267] border-[#C5A267]/30 hover:bg-[#C5A267] hover:text-[#0A0A0B]'
                          }`}
                        >
                          + {preset.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Evaluated credit mapping summary breakdown */}
              <div className="bg-[#16161A] rounded-xl border border-white/5 p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-serif text-[#F4F4F5] text-sm font-semibold">Academic Equivalency Catalog</h3>
                    <p className="text-xs text-[#A1A1AA] mt-1">Mappings computed for target institution: {targetUniv.name}</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded bg-[#1F1F23] border border-white/5 text-xs space-y-2">
                    <p className="font-bold text-[#C5A267]">How major requirements are mapped:</p>
                    <ul className="space-y-1.5 list-none text-[#A1A1AA]">
                      <li className="flex items-start gap-1.5"><span className="text-[#C5A267] mt-0.5">•</span><span><strong className="text-[#E4E4E7]">CS 110</strong> (PTU) maps to <strong className="text-[#E4E4E7]">CSCI 141</strong> (Java Intro) as Major Core.</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#C5A267] mt-0.5">•</span><span><strong className="text-[#E4E4E7]">CS 220</strong> (PTU) maps to <strong className="text-[#E4E4E7]">CSCI 241</strong> (Intermediate Structures) as Major Core.</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#C5A267] mt-0.5">•</span><span><strong className="text-[#E4E4E7]">MATH 101</strong> (PTU) maps to <strong className="text-[#E4E4E7]">MATH 211</strong> (Mathematical Analysis) as Gen Ed.</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#C5A267] mt-0.5">•</span><span><strong className="text-[#E4E4E7]">ENG 150</strong> (PTU) maps to <strong className="text-[#E4E4E7]">COMM 201</strong> (Professional Technical Speech) as Gen Ed.</span></li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-[#A1A1AA] font-bold font-mono uppercase tracking-wider">Course fulfillment details</p>
                  <div className="bg-[#1F1F23]/40 rounded p-4 border border-[#C5A267]/20 flex items-start gap-3">
                    <Info className="h-5 w-5 text-[#C5A267] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">
                      All preset credit evaluations run under safe registrar standards. You can evaluate and match a completely custom course layout on the **Syllabus Matcher** tab page to see them map here live!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulator
            studentCourses={studentHistoryCourses}
            sourceUniversity={sourceUniv}
          />
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-[#16161A] rounded-xl border border-white/5 p-6">
              <h2 className="text-xl font-serif text-[#F4F4F5] tracking-tight">Certified Academic Transfer Ledger</h2>
              <p className="text-xs text-[#A1A1AA] mt-1.5">
                Your secure history record of completed syllabus matching evaluations and official credit equivalency certifications.
              </p>
            </div>

            {transferLedger.length === 0 ? (
              <div className="p-12 text-center rounded-xl border-2 border-dashed border-white/10 bg-[#16161A] space-y-4">
                <Database className="h-10 w-10 text-[#52525B] mx-auto" />
                <h4 className="font-semibold text-[#E4E4E7] text-sm">No saved evaluations in local storage ledger</h4>
                <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
                  Run a single-course syllabus match evaluation using our cognitive tool above and click "Save to Transfer Ledger" to record your certified evaluations.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transferLedger.map((record, index) => (
                  <div
                    key={index}
                    className="bg-[#16161A] rounded-xl border border-white/5 p-5 shadow-xl space-y-4 hover:border-[#C5A267]/30 transition-all relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-[#1F1F23] text-[#A1A1AA] border border-white/5 font-bold px-2 py-0.5 rounded font-mono">
                          {record.evaluationDate}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                          record.status === 'equivalent' ? 'bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/30' : 'bg-[#1F1F23] text-amber-300 border border-white/5'
                        }`}>
                          {record.status === 'equivalent' ? 'Full Match' : 'Partial Match'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-[#A1A1AA] font-mono block tracking-wider uppercase">Source Course</span>
                        <p className="font-serif text-[#F4F4F5] text-sm mt-0.5">{record.sourceCourseCode}: {record.sourceCourseTitle}</p>
                      </div>

                      <div className="border-t border-dashed border-white/10 pt-2.5">
                        <span className="text-[9px] font-bold text-[#A1A1AA] font-mono block tracking-wider uppercase">Recommended Target Equivalency</span>
                        <p className="font-serif text-[#C5A267] text-sm mt-0.5">{record.targetCourseCode}: {record.targetCourseTitle}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center pt-2 font-mono border-t border-white/5">
                        <div className="p-2 bg-[#1F1F23] rounded">
                          <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase">Match Score</span>
                          <strong className="text-sm text-[#F4F4F5]">{record.matchScore}%</strong>
                        </div>
                        <div className="p-2 bg-[#1F1F23] rounded">
                          <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase">Approved Credits</span>
                          <strong className="text-sm text-[#F4F4F5]">{record.creditRecommendation}cr</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => {
                          setEvaluationResult(record);
                          setActiveTab('single');
                        }}
                        className="flex-1 bg-[#1F1F23] hover:bg-[#2A2A30] text-[#E4E4E7] border border-white/5 font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#C5A267]" /> View Certificate
                      </button>
                      <button
                        onClick={() => {
                          const updated = transferLedger.filter((_, i) => i !== index);
                          saveLedgerToStorage(updated);
                        }}
                        className="bg-red-950/40 hover:bg-rose-950 text-rose-400 border border-rose-900/30 font-bold text-xs py-2 px-3 rounded transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'global' && (
          <InternationalSettingsPane />
        )}
      </main>

      {/* Authority Credit Footer */}
      <footer className="bg-[#0F0F12] border-t border-white/10 py-6 px-10 text-center text-xs text-[#52525B] font-medium tracking-wide">
        <p>© 2026 Academic Credit Evaluator. All rights reserved. Platform powered by Gemini Full-Stack Integration.</p>
      </footer>

    </div>
  );
}
