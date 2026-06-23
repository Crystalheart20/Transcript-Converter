/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EvaluationResult, University } from '../types';
import { Printer, Calendar, ShieldCheck, Scale, AlertTriangle, CheckSquare, Award, AlertCircle, Copy, Share2, CornerRightDown } from 'lucide-react';

interface EvaluationReportViewProps {
  evaluation: EvaluationResult;
  sourceUniv: University;
  targetUniv: University;
  onSaveToHistory?: () => void;
  isSavedInHistory?: boolean;
}

export default function EvaluationReportView({
  evaluation,
  sourceUniv,
  targetUniv,
  onSaveToHistory,
  isSavedInHistory,
}: EvaluationReportViewProps) {
  const {
    sourceCourseCode = '',
    sourceCourseTitle = '',
    targetCourseCode = '',
    targetCourseTitle = '',
    matchScore = 0,
    status = 'not_equivalent',
    rationale = '',
    creditRecommendation = 0,
    targetRequirementCategory = 'none',
    suggestedLevel = 'lower_division',
    evaluationDate = '',
    keyTopicsMatched = [],
    missingTopics = [],
  } = evaluation || {};

  // Status mapping
  const statusConfig = {
    equivalent: {
      label: 'Fully Equivalent',
      color: 'bg-[#C5A267]/10 text-[#C5A267] border-[#C5A267]/20',
      percentageColor: 'text-[#C5A267]',
      badge: 'bg-[#C5A267] text-[#0A0A0B]',
      msg: 'Accepted for direct substitution of degree requirements.',
    },
    half_equivalent: {
      label: 'Partially Equivalent',
      color: 'bg-[#1F1F23] text-amber-300 border-white/5',
      percentageColor: 'text-amber-300',
      badge: 'bg-[#1F1F23] text-amber-300 border border-white/5',
      msg: 'Accepted as major elective or specific course waiver pending review.',
    },
    not_equivalent: {
      label: 'Not Equivalent',
      color: 'bg-[#1F1F23] text-rose-400 border-white/5',
      percentageColor: 'text-rose-400',
      badge: 'bg-[#1F1F23] text-rose-400 border border-white/5',
      msg: 'Evaluated as free general elective credit or non-equivalent syllabus coverage.',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.not_equivalent;

  const handlePrint = () => {
    window.print();
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'major_core': return 'Major Core Requirements';
      case 'major_elective': return 'Major Program Electives';
      case 'general_education': return 'General Education & Writing Core';
      case 'free_elective': return 'General Free Electives';
      default: return 'No direct fulfillment';
    }
  };

  // Generate a mock verification hash ID for realistic feel
  const safeSourceCode = (sourceCourseCode || '').replace(/\s+/g, '');
  const safeTargetCode = (evaluation?.targetCourseCode || '').replace(/\s+/g, '');
  const safeDate = (evaluationDate || '').replace(/\//g, '');
  const certHash = `TX-${safeSourceCode}-${safeTargetCode}-${matchScore}-${safeDate}`;

  return (
    <div className="space-y-4" id="evaluation-report">
      {/* Action Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111115] text-[#E4E4E7] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#C5A267]" />
          <span className="text-[10px] font-bold font-mono tracking-wider text-[#A1A1AA] uppercase">Certified Security Status</span>
        </div>
        <div className="flex items-center gap-2">
          {onSaveToHistory && (
            <button
              onClick={onSaveToHistory}
              className={`text-xs px-3.5 py-2 rounded font-bold transition-all flex items-center gap-1.5 ${
                isSavedInHistory
                  ? 'bg-[#1F1F23] text-[#A1A1AA] border border-white/5 pointer-events-none'
                  : 'bg-[#C5A267] hover:brightness-110 text-[#0A0A0B]'
              }`}
            >
              <Award className="h-4 w-4" />
              {isSavedInHistory ? 'Saved in Ledger' : 'Save to Transfer Ledger'}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="text-xs font-bold px-3.5 py-2 rounded bg-[#1F1F23] hover:bg-[#2A2A30] text-[#E4E4E7] border border-white/5 flex items-center gap-1.5 transition-all"
          >
            <Printer className="h-4 w-4" /> Print Document
          </button>
        </div>
      </div>

      {/* Actual Certificate PDF Block */}
      <div className="bg-[#16161A] border border-white/5 rounded-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden print:border-none print:shadow-none">
        
        {/* Certificate Border Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C5A267]" />
        
        {/* Verification stamp background decoration (classical academic look) */}
        <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.01]">
          <Award className="h-96 w-96 text-white" />
        </div>

        {/* Certificate Header layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C5A267]">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-extrabold tracking-widest text-[10px] font-mono uppercase">OFFICIAL REGISTRAR RECORD</span>
            </div>
            <h2 className="text-2xl font-serif text-[#F4F4F5] tracking-tight">Equivalency Evaluation Report</h2>
            <p className="text-xs text-[#A1A1AA] font-mono tracking-wide mt-1">SYSTEM HASH: {certHash}</p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs text-[#A1A1AA] space-y-1 sm:border-l sm:border-white/5 sm:pl-6">
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Calendar className="h-3.5 w-3.5 text-[#C5A267]" />
              <span>Assessment Date: <strong>{evaluationDate}</strong></span>
            </div>
            <p>Auditor: <strong>Gemini Cognitive Core</strong></p>
            <p>Verification Link: <span className="text-[#C5A267] underline cursor-pointer">Verify.EDU</span></p>
          </div>
        </div>

        {/* Academic Mapping Pipeline */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-11 items-center gap-4 p-4 bg-[#1F1F23]/60 rounded border border-white/5">
          <div className="md:col-span-5 bg-[#16161A] p-4 rounded border border-white/5 shadow-sm">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-[#A1A1AA]">Source Syllabus Institution</span>
            <p className="font-serif text-[#F4F4F5] text-sm mt-1">{sourceUniv.name}</p>
            <div className="mt-3 bg-[#1F1F23] p-2.5 rounded border border-white/5">
              <span className="font-mono text-xs font-bold text-[#C5A267]">{sourceCourseCode}</span>
              <p className="font-serif text-[#E4E4E7] text-sm mt-1">{sourceCourseTitle}</p>
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center">
            <div className="bg-[#1F1F23] p-2.5 rounded-full border border-white/5 shadow-sm flex items-center justify-center">
              <CornerRightDown className="h-5 w-5 text-[#C5A267] rotate-0 md:-rotate-90" />
            </div>
          </div>

          <div className="md:col-span-5 bg-[#16161A] p-4 rounded border border-white/5 shadow-sm">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-[#A1A1AA]">Target Equivalency Institution</span>
            <p className="font-serif text-[#F4F4F5] text-sm mt-1">{targetUniv.name}</p>
            <div className="mt-3 bg-[#1F1F23] p-2.5 rounded border border-white/5">
              <span className="font-mono text-xs font-bold text-[#C5A267]">{targetCourseCode}</span>
              <p className="font-serif text-[#E4E4E7] text-sm mt-1">{targetCourseTitle}</p>
            </div>
          </div>
        </div>

        {/* Assessment Scoring Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          <div className="border border-white/5 p-4 rounded bg-[#1C1C21] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase font-mono">Matched Overlap Percentage</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p className={`font-mono text-4xl font-extrabold ${currentStatus.percentageColor}`}>{matchScore}%</p>
              <span className="text-[10px] text-[#A1A1AA] font-mono">Topic Overlap</span>
            </div>
            {/* Visual Micro Bar */}
            <div className="w-full bg-[#111115] h-1.5 rounded mt-3 overflow-hidden border border-white/5">
              <div className={`h-full bg-[#C5A267]`} style={{ width: `${matchScore}%` }} />
            </div>
          </div>

          <div className={`border p-4 rounded bg-[#1C1C21] shadow-xs flex flex-col justify-between ${currentStatus.color}`}>
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Transfer Classification</span>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${currentStatus.badge}`}>
                {currentStatus.label}
              </span>
            </div>
            <p className="text-xs mt-3 leading-snug">{currentStatus.msg}</p>
          </div>

          <div className="border border-white/5 p-4 rounded bg-[#1C1C21] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase font-mono">Credit Units Approved</span>
            <div className="flex items-baseline gap-1 mt-2">
              <p className="font-mono text-4xl font-extrabold text-[#F4F4F5]">{creditRecommendation.toFixed(1)}</p>
              <span className="text-xs text-[#A1A1AA]">Credits Awarded</span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-3">
              Code: <span className="font-mono text-[#C5A267] bg-[#111115] px-1.5 py-0.5 rounded text-[10px] border border-white/5">{targetRequirementCategory}</span>
            </p>
          </div>

        </div>

        {/* Analytical Rationale Text */}
        <div className="border border-white/5 rounded p-5 bg-[#1F1F23]/40 mb-6 space-y-2.5">
          <div className="flex items-center gap-2 text-[#C5A267] font-bold text-sm">
            <Scale className="h-4 w-4" />
            <h4 className="font-serif text-[#F4F4F5] text-sm">Evaluator Comparative Rationale</h4>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans mt-1">
            {rationale}
          </p>
        </div>

        {/* Detailed Topic Matching Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          
          <div className="border border-white/5 rounded p-4 bg-[#1F1F23]/60">
            <div className="flex items-center gap-2 text-[#C5A267] font-bold text-[10px] uppercase tracking-wider font-mono mb-3">
              <CheckSquare className="h-4 w-4" />
              <span>Matching Learning Overlaps ({keyTopicsMatched.length})</span>
            </div>
            {keyTopicsMatched.length === 0 ? (
              <p className="text-xs text-[#A1A1AA] italic">No direct topic matching located in syllabus.</p>
            ) : (
              <ul className="space-y-1.5">
                {keyTopicsMatched.map((topic, idx) => (
                  <li key={idx} className="text-xs text-[#A1A1AA] flex items-start gap-2">
                    <span className="h-1.5 w-1.5 bg-[#C5A267] rounded-full mt-1.5 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-white/5 rounded p-4 bg-[#1F1F23]/60">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-[10px] uppercase tracking-wider font-mono mb-3">
              <AlertCircle className="h-4 w-4" />
              <span>Outstanding / Unmatched Materials ({missingTopics.length})</span>
            </div>
            {missingTopics.length === 0 ? (
              <p className="text-xs text-[#A1A1AA] italic">No critical topical shortcomings identified.</p>
            ) : (
              <ul className="space-y-1.5">
                {missingTopics.map((topic, idx) => (
                  <li key={idx} className="text-xs text-[#A1A1AA] flex items-start gap-2">
                    <span className="h-1.5 w-1.5 bg-[#C5A267]/40 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Printable Footer / Signatures */}
        <div className="border-t border-white/5 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="space-y-1 text-[#A1A1AA]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#C5A267]" />
              <p className="text-[10px] font-bold font-mono tracking-wider text-[#F4F4F5] uppercase">Verification Authenticity Seal</p>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              This document serves as an official technical course-matching estimate generated by the University Cognitive Audit Network. Authenticity can be verified securely.
            </p>
          </div>
          
          <div className="flex flex-col items-start sm:items-end justify-center space-y-2">
            <div className="w-48 border-b border-white/10 text-center pb-1">
              <span className="font-mono font-bold text-[#C5A267] text-xs italic tracking-wider">Gemini Cognitron</span>
            </div>
            <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono mr-2">Joint Academic Coordinator Signature</span>
          </div>
        </div>

      </div>
    </div>
  );
}
