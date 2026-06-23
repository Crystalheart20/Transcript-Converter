/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, HelpCircle, Award, Landmark } from 'lucide-react';

interface RequirementProgress {
  category: 'major_core' | 'major_elective' | 'general_education' | 'free_elective';
  required: number;
  fulfilled: number;
}

interface DegreeProgressBarProps {
  programName: string;
  totalRequired: number;
  totalFulfilled: number;
  fulfillment: RequirementProgress[];
}

const CATEGORY_META = {
  major_core: {
    label: 'Major Core',
    color: 'text-[#C5A267] border-white/5 bg-[#1F1F23]',
    barColor: 'bg-[#C5A267]',
    bgLight: 'bg-[#1F1F23]',
  },
  major_elective: {
    label: 'Major Electives',
    color: 'text-[#E4E4E7] border-white/5 bg-[#1F1F23]',
    barColor: 'bg-white',
    bgLight: 'bg-[#1F1F23]',
  },
  general_education: {
    label: 'General Education',
    color: 'text-[#D4D4D8] border-white/5 bg-[#1F1F23]',
    barColor: 'bg-[#C5A267]/75',
    bgLight: 'bg-[#1F1F23]',
  },
  free_elective: {
    label: 'Free Electives',
    color: 'text-[#A1A1AA] border-white/5 bg-[#1F1F23]',
    barColor: 'bg-[#52525B]',
    bgLight: 'bg-[#1F1F23]',
  },
};

export default function DegreeProgressBar({
  programName,
  totalRequired,
  totalFulfilled,
  fulfillment = [],
}: DegreeProgressBarProps) {
  const percentOverall = Math.min(100, Math.round((totalFulfilled / totalRequired) * 100)) || 0;

  return (
    <div className="bg-[#16161A] rounded-xl border border-white/5 shadow-2xl p-6 space-y-6" id="degree-progress-bar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C5A267] uppercase font-mono">Graduation Audit</span>
          <h3 className="text-xl font-serif text-[#F4F4F5] tracking-tight mt-1">{programName}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono">Degree Progress</p>
            <p className="font-mono text-sm font-bold text-[#F4F4F5]">
              {totalFulfilled} / {totalRequired} <span className="text-xs text-[#A1A1AA] font-normal">Credits</span>
            </p>
          </div>
          <div className="relative h-14 w-14 flex items-center justify-center bg-[#1F1F23] rounded-full border border-white/5">
            <span className="font-mono font-extrabold text-sm text-[#C5A267] sm:text-base">
              {percentOverall}%
            </span>
          </div>
        </div>
      </div>

      {/* Graduation Requirements Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(fulfillment || []).map((item) => {
          const meta = CATEGORY_META[item.category] || CATEGORY_META.free_elective;
          const categoryPercent = Math.min(100, Math.round((item.fulfilled / item.required) * 100)) || 0;
          return (
            <div
              key={item.category}
              className={`p-4 rounded border border-white/5 ${meta.bgLight} transition-all`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A267] font-mono">
                    {meta.label}
                  </span>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Fulfillment: <strong className="text-[#F4F4F5]">{item.fulfilled}</strong> of {item.required} credits
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${categoryPercent === 100 ? 'bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/20' : 'bg-[#16161A] text-[#A1A1AA]'}`}>
                  {categoryPercent}%
                </span>
              </div>

              {/* Progress Slider Bar */}
              <div className="w-full bg-[#16161A] h-2.5 rounded overflow-hidden mt-3 border border-white/5">
                <div
                  className={`h-full ${meta.barColor} transition-all duration-500`}
                  style={{ width: `${categoryPercent}%` }}
                />
              </div>

              {/* Action standard indicators */}
              <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#A1A1AA] font-medium">
                {categoryPercent === 100 ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-[#C5A267]" />
                    <span className="text-[#C5A267]">Requirement fully met</span>
                  </>
                ) : categoryPercent > 0 ? (
                  <>
                    <Award className="h-3 w-3 text-[#C5A267] animate-pulse" />
                    <span>Credits applied from evaluations</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-3 w-3 text-[#52525B]" />
                    <span>0 mapped credits. Select courses to transfer.</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-[#1F1F23]/40 rounded p-4 border border-white/5 flex items-center gap-3">
        <Landmark className="h-5 w-5 text-[#C5A267] flex-shrink-0" />
        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          The equivalencies calculated above are estimated using syllabi criteria comparison and subject matter audits. Actual credit transfers may be impacted by minimum grade guidelines.
        </p>
      </div>
    </div>
  );
}
