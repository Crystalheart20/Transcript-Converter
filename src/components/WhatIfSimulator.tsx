/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Course, University } from '../types';
import { SAMPLE_UNIVERSITIES } from '../data/sampleData';
import { Landmark, ArrowRight, TrendingUp, Sparkles, AlertCircle, HelpCircle, GraduationCap } from 'lucide-react';

interface WhatIfSimulatorProps {
  studentCourses: Course[];
  sourceUniversity: University;
}

export default function WhatIfSimulator({
  studentCourses,
  sourceUniversity,
}: WhatIfSimulatorProps) {
  // We'll simulate transfer mapping parallelly for two top candidate target universities:
  // 1. Pacific Technological University (if source isn't PT)
  // 2. Metro State University (if source isn't MS)
  // Otherwise Eastern Ivy. Let's filter targets
  const targetUnivs = SAMPLE_UNIVERSITIES.filter(u => u.id !== sourceUniversity.id).slice(0, 2);

  // Helper function to simulate transfer mapping on-the-fly for presentation comparisons
  const runParallelSimulation = (targetUniv: University) => {
    let totalCreditsMapped = 0;
    let coreCreditsMatched = 0;
    let genEdCreditsMatched = 0;
    let freeCreditsMatched = 0;
    const mappedDetails: { source: string, target: string, match: number, status: string }[] = [];

    studentCourses.forEach(course => {
      const srcCode = course.code.toUpperCase();
      const srcDesc = `${course.title} ${course.description} ${course.syllabusExcerpt || ''}`.toLowerCase();

      // Check against CS matching logic
      if (srcCode.includes('CS') || srcCode.includes('CSC')) {
        if (srcCode.includes('101') || srcCode.includes('110') || srcCode.includes('141')) {
          // Introductory python/java
          coreCreditsMatched += 4;
          totalCreditsMapped += 4;
          mappedDetails.push({
            source: course.code,
            target: targetUniv.id === 'univ_pacific_tech' ? 'CS 110' : 'CSCI 141',
            match: targetUniv.id === 'univ_pacific_tech' ? 90 : 85,
            status: 'Core Match',
          });
        } else if (srcCode.includes('201') || srcCode.includes('220') || srcCode.includes('241')) {
          // Data structures
          coreCreditsMatched += 4;
          totalCreditsMapped += 4;
          mappedDetails.push({
            source: course.code,
            target: targetUniv.id === 'univ_pacific_tech' ? 'CS 220' : 'CSCI 241',
            match: targetUniv.id === 'univ_pacific_tech' ? 95 : 92,
            status: 'Core Match',
          });
        } else if (srcCode.includes('340') || srcDesc.includes('database') || srcDesc.includes('sql')) {
          coreCreditsMatched += targetUniv.id === 'univ_pacific_tech' ? 3 : 4;
          totalCreditsMapped += targetUniv.id === 'univ_pacific_tech' ? 3 : 4;
          mappedDetails.push({
            source: course.code,
            target: targetUniv.id === 'univ_pacific_tech' ? 'CS 340' : 'CSCI 351',
            match: 91,
            status: 'Core Match',
          });
        } else {
          freeCreditsMatched += course.credits;
          totalCreditsMapped += course.credits;
          mappedDetails.push({
            source: course.code,
            target: 'CS Elective',
            match: 70,
            status: 'Elective Matched',
          });
        }
      } 
      // Calculus
      else if (srcCode.includes('MATH')) {
        genEdCreditsMatched += 4;
        totalCreditsMapped += 4;
        mappedDetails.push({
          source: course.code,
          target: targetUniv.id === 'univ_pacific_tech' ? 'MATH 101' : 'MATH 211',
          match: 92,
          status: 'Gen Ed Applied',
        });
      } 
      // English/Writing
      else if (srcCode.includes('ENG') || srcCode.includes('COMM')) {
        genEdCreditsMatched += 3;
        totalCreditsMapped += 3;
        mappedDetails.push({
          source: course.code,
          target: targetUniv.id === 'univ_pacific_tech' ? 'ENG 150' : 'COMM 201',
          match: 86,
          status: 'Gen Ed Applied',
        });
      } 
      // Default fallback
      else {
        freeCreditsMatched += course.credits;
        totalCreditsMapped += course.credits;
        mappedDetails.push({
          source: course.code,
          target: 'Free Elective',
          match: 55,
          status: 'General Applied',
        });
      }
    });

    const averageMatchScore = mappedDetails.length > 0 
      ? Math.round(mappedDetails.reduce((sum, item) => sum + item.match, 0) / mappedDetails.length)
      : 0;

    return {
      university: targetUniv,
      totalCreditsMapped,
      averageMatchScore,
      coreCreditsMatched,
      genEdCreditsMatched,
      freeCreditsMatched,
      mappedDetails,
      degreeProgress: Math.min(100, Math.round((totalCreditsMapped / 120) * 100)),
    };
  };

  const simulatedResults = targetUnivs.map(univ => runParallelSimulation(univ));

  return (
    <div className="bg-[#16161A] rounded-xl border border-white/5 p-6 space-y-6" id="what-if-comparison">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#C5A267]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-bold font-mono tracking-[0.2em] uppercase">Scenario Comparison Playground</span>
          </div>
          <h3 className="text-xl font-serif text-[#F4F4F5] tracking-tight mt-1.5">What-If Transfer Analyzer</h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Compare credit yields side-by-side across major universities based on your loaded courses.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-wider bg-[#1F1F23] border border-white/5 text-[#C5A267] font-mono font-bold px-3.5 py-1.5 rounded">
          Simulating {studentCourses.length} Courses
        </div>
      </div>

      {studentCourses.length === 0 ? (
        <div className="p-8 text-center rounded border border-white/5 bg-[#1F1F23]/30">
          <HelpCircle className="h-10 w-10 text-[#52525B] mx-auto mb-3" />
          <h4 className="font-serif text-[#F4F4F5] text-sm">Add custom or catalog courses first</h4>
          <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto mt-1">
            We will dynamically compute a side-by-side transfer evaluation ledger comparing how your classes map to different campus programs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simulatedResults.map((res, idx) => {
            const hasBestScore = idx === 0 || res.totalCreditsMapped >= simulatedResults[0].totalCreditsMapped;
            return (
              <div
                key={res.university.id}
                className="bg-[#1F1F23] border border-white/5 rounded-xl p-5 space-y-4 relative overflow-hidden transition-all hover:bg-[#232328] flex flex-col justify-between"
              >
                {/* Visual Ribbon marker */}
                {hasBestScore && (
                  <div className="absolute top-0 right-0 bg-[#C5A267] text-[#0A0A0B] font-mono font-extrabold text-[9px] px-3 py-1 uppercase tracking-wider rounded-bl shadow-xs flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Max Equivalency
                  </div>
                )}

                <div className="space-y-3">
                  {/* Institution branding header */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-[#16161A] rounded border border-white/5 flex items-center justify-center font-bold text-[#C5A267] text-base font-serif flex-shrink-0">
                      {res.university.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif text-[#F4F4F5] text-base leading-snug">{res.university.name}</h4>
                      <p className="text-xs text-[#A1A1AA]">{res.university.location}</p>
                    </div>
                  </div>

                  {/* Transfer credit dashboard indicators */}
                  <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#16161A] rounded border border-white/5 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase tracking-wider">Transferred</span>
                      <strong className="text-lg text-[#F4F4F5] block mt-0.5">{res.totalCreditsMapped} <span className="text-[10px] text-[#A1A1AA] font-normal">cr</span></strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase tracking-wider">Avg Overlap</span>
                      <strong className="text-lg text-[#C5A267] block mt-0.5">{res.averageMatchScore}%</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase tracking-wider">Degree Met</span>
                      <strong className="text-lg text-[#C5A267]/80 block mt-0.5">{res.degreeProgress}%</strong>
                    </div>
                  </div>

                  {/* Detailed Mapping Board */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#A1A1AA] font-mono tracking-wider block uppercase">Top Syllabus Equivalency Matches</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {res.mappedDetails.map((match, mIdx) => (
                        <div key={mIdx} className="text-xs flex items-center justify-between p-2 hover:bg-[#16161A] rounded transition-colors border border-white/5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#C5A267] font-mono bg-[#16161A] px-1.5 py-0.5 rounded text-[10px] border border-white/5">
                              {match.source}
                            </span>
                            <ArrowRight className="h-3 w-3 text-[#A1A1AA]" />
                            <span className="font-semibold text-white font-mono">
                              {match.target}
                            </span>
                          </div>
                          <span className={`font-mono text-[10px] font-bold ${match.match >= 85 ? 'text-[#C5A267]' : 'text-[#A1A1AA]'}`}>
                            {match.match}% [{match.status}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A1A1AA] font-bold font-mono uppercase tracking-wider">BS Computer Science Track</span>
                    <button
                      type="button"
                      className="text-[11px] font-bold text-[#C5A267] hover:brightness-110 flex items-center gap-1"
                    >
                      View Requirements <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Analytical Recommendation banner */}
      {studentCourses.length > 0 && (
        <div className="p-4 bg-[#1F1F23]/60 border border-white/5 rounded flex items-start gap-3">
          <GraduationCap className="h-5 w-5 text-[#C5A267] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-[#C5A267] uppercase tracking-wider font-mono">University Transfer Evaluation Digest</p>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mt-1">
              Based on your comparative simulation report, transferring your courses to{' '}
              <strong>Pacific Technological University</strong> yields an average syllabus matching score of{' '}
              <strong>{simulatedResults[0]?.averageMatchScore}%</strong>, making it the most optimal destination. It leaves you only needing to fulfill fewer elective modules before achieving degree completion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
