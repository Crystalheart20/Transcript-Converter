/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Info, 
  Award, 
  Layers, 
  CheckCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export function InternationalSettingsPane() {
  const [activeSubTab, setActiveSubTab] = useState<'credit' | 'grading' | 'nigeria'>('credit');

  // --- Credit Unit Converter State & Logic ---
  const [sourceSystem, setSourceSystem] = useState<string>('us_semester');
  const [sourceValue, setSourceValue] = useState<number>(3);

  // Conversion rates baseline (mapped to US Semester equivalent value = 1)
  const systemMeta: Record<string, { name: string; coeff: number; unit: string; desc: string }> = {
    us_semester: {
      name: 'US Semester System (Credits)',
      coeff: 1.0,
      unit: 'sem cr',
      desc: 'Standard North American system. 1 credit represents 1 contact hour per week.'
    },
    us_quarter: {
      name: 'US Quarter System (Credits)',
      coeff: 1.5,
      unit: 'qtr cr',
      desc: 'Used in West Coast US models. 1.5 Quarter credits = 1 Semester credit.'
    },
    ects: {
      name: 'European Credit Transfer System (ECTS)',
      coeff: 2.0,
      unit: 'ECTS',
      desc: 'Standard across all Bologna-process EU schools. 2 ECTS = 1 US Semester credit.'
    },
    uk_cats: {
      name: 'UK CATS (Credit Accumulation & Transfer)',
      coeff: 4.0,
      unit: 'CATS',
      desc: 'Standard academic credit scoring in the UK. 4 CATS = 1 US Semester credit.'
    },
    nigeria_nuc: {
      name: 'Nigerian NUC Credit Units',
      coeff: 1.0,
      unit: 'units',
      desc: 'National Universities Commission (NUC) standard. Typically aligned 1:1 with US Semester.'
    }
  };

  const handleSourceValueChange = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setSourceValue(num);
    } else {
      setSourceValue(0);
    }
  };

  // Convert current source input to all other systems
  const getConvertedCredits = (targetKey: string) => {
    if (sourceValue <= 0) return 0;
    const baseVal = sourceValue / systemMeta[sourceSystem].coeff; // convert to base (US Semester)
    const converted = baseVal * systemMeta[targetKey].coeff;
    return parseFloat(converted.toFixed(1));
  };


  // --- Grading Scale State & Logic ---
  const [gradingSource, setGradingSource] = useState<string>('nigeria_5point');
  const [inputGrade, setInputGrade] = useState<string>('4.5'); // default first class / excellent

  // High fidelity equivalence scale definitions
  const gradeSystemMeta: Record<string, { name: string; list: { val: string; label: string }[] }> = {
    us_4point: {
      name: 'US 4.0 GPA Scale',
      list: [
        { val: '4.0', label: 'Grade A (Excellent)' },
        { val: '3.7', label: 'Grade A- (Very Good)' },
        { val: '3.3', label: 'Grade B+ (Good)' },
        { val: '3.0', label: 'Grade B (Above Average)' },
        { val: '2.7', label: 'Grade B- (Average)' },
        { val: '2.0', label: 'Grade C (Satisfactory)' },
        { val: '1.0', label: 'Grade D (Poor)' },
        { val: '0.0', label: 'Grade F (Fail)' },
      ]
    },
    nigeria_5point: {
      name: 'Nigeria 5.0 CGPA Scale (NUC Standard)',
      list: [
        { val: '4.5', label: 'First Class Honors (Excellent / CGPA 4.50 - 5.00)' },
        { val: '3.5', label: 'Second Class Honors Upper Division (CGPA 3.50 - 4.49)' },
        { val: '2.4', label: 'Second Class Honors Lower Division (CGPA 2.40 - 3.49)' },
        { val: '1.5', label: 'Third Class Honors (CGPA 1.50 - 2.39)' },
        { val: '1.0', label: 'Pass Degree (CGPA 1.00 - 1.49)' },
        { val: '0.0', label: 'Fail (CGPA < 1.00)' },
      ]
    },
    uk_class: {
      name: 'UK Undergraduate Classifications',
      list: [
        { val: '70%+', label: 'First Class Honors (1st)' },
        { val: '60%-69%', label: 'Upper Second Class Honors (2:1)' },
        { val: '50%-59%', label: 'Lower Second Class Honors (2:2)' },
        { val: '40%-49%', label: 'Third Class Honors (3rd)' },
        { val: '35%-39%', label: 'Pass Degree Status' },
        { val: '<35%', label: 'Fail / No Award' },
      ]
    },
    ects_grade: {
      name: 'European ECTS Grade Letters',
      list: [
        { val: 'A', label: 'ECTS A (Outstanding - top 10%)' },
        { val: 'B', label: 'ECTS B (Excellent - next 25%)' },
        { val: 'C', label: 'ECTS C (Very Good - next 30%)' },
        { val: 'D', label: 'ECTS D (Highly Satisfactory - next 25%)' },
        { val: 'E', label: 'ECTS E (Sufficient - next 10%)' },
        { val: 'F', label: 'ECTS FX/F (Fail / Unsuccessful)' },
      ]
    }
  };

  // Precomputed maps to translate scale entries
  const translateGrade = (srcScale: string, targetScale: string, currentVal: string) => {
    // We find index of current value in source Scale, map to proportional position in target scale
    const sourceList = gradeSystemMeta[srcScale].list;
    const targetList = gradeSystemMeta[targetScale].list;
    
    const srcIndex = sourceList.findIndex(item => item.val === currentVal);
    if (srcIndex === -1) {
      // Find closest or default to first
      return targetList[0];
    }
    
    // Proportional index translation
    const propIndex = Math.min(targetList.length - 1, Math.round((srcIndex / (sourceList.length - 1)) * (targetList.length - 1)));
    return targetList[propIndex];
  };

  return (
    <div className="space-y-6" id="international-conversion-settings">
      <div className="bg-[#16161A] rounded-xl border border-white/5 p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#C5A267]">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-bold font-mono tracking-[0.2em] uppercase">Global Credential Settings</span>
            </div>
            <h2 className="text-xl font-serif text-[#F4F4F5] tracking-tight mt-1">International Educational Interconverter</h2>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Factor different academic methodologies, credit weights, and grading benchmarks to ensure precise compliance audits.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#1F1F23] border border-white/5 text-[10px] uppercase font-mono font-bold px-3 py-1.5 rounded text-[#C5A267]">
            <span className="h-2 w-2 rounded-full bg-[#C5A267] animate-pulse" /> NUC Standard Compliant
          </div>
        </div>

        {/* Local Tab Navigation */}
        <div className="flex gap-2 border-b border-white/5 pb-1 overflow-x-auto select-none">
          <button
            onClick={() => setActiveSubTab('credit')}
            className={`pb-2.5 px-1.5 font-mono text-[11px] uppercase tracking-wider border-b-2 font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'credit'
                ? 'border-[#C5A267] text-[#C5A267]'
                : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            Credit Accumulator Converter
          </button>
          <button
            onClick={() => setActiveSubTab('grading')}
            className={`pb-2.5 px-1.5 font-mono text-[11px] uppercase tracking-wider border-b-2 font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'grading'
                ? 'border-[#C5A267] text-[#C5A267]'
                : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            GPA & Grades Translator
          </button>
          <button
            onClick={() => setActiveSubTab('nigeria')}
            className={`pb-2.5 px-1.5 font-mono text-[11px] uppercase tracking-wider border-b-2 font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'nigeria'
                ? 'border-[#C5A267] text-[#C5A267]'
                : 'border-transparent text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            Nigerian NUC System Spotlight
          </button>
        </div>

        {/* --- Tab Content: Credit Unit Converter --- */}
        {activeSubTab === 'credit' && (
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-[#1F1F23]/40 border border-white/5 rounded text-xs text-[#A1A1AA] leading-relaxed">
              Academic credit hour guidelines differ significantly across countries. A bachelor degree requires about <strong className="text-white">120 Semester Credits</strong> in the US/NUC, <strong className="text-white">180 Quarter Credits</strong>, <strong className="text-white">240 ECTS credits</strong> in Europe, or <strong className="text-white">480 CATS units</strong> in the UK. Adjust values below to auto-convert credit equivalents in real-time.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Input Panel */}
              <div className="md:col-span-5 bg-[#1F1F23] p-5 rounded-lg border border-white/5 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A1A1AA] font-mono tracking-wider block mb-1.5">
                    Source Credit System
                  </label>
                  <select
                    value={sourceSystem}
                    onChange={(e) => setSourceSystem(e.target.value)}
                    className="w-full bg-[#16161A] border border-white/10 rounded px-3 py-2 text-xs text-[#F4F4F5] font-serif focus:outline-none focus:border-[#C5A267]"
                  >
                    {Object.entries(systemMeta).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A1A1AA] font-mono tracking-wider block mb-1.5">
                    Credit / Unit Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.5"
                      max="60"
                      step="0.5"
                      value={sourceValue}
                      onChange={(e) => handleSourceValueChange(e.target.value)}
                      className="w-full bg-[#16161A] border border-white/10 rounded pl-4 pr-16 py-2.5 text-base font-mono text-[#F4F4F5] focus:outline-none focus:border-[#C5A267]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#C5A267] uppercase">
                      {systemMeta[sourceSystem].unit}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A1A1AA] mt-1.5 leading-relaxed font-sans font-medium">
                    {systemMeta[sourceSystem].desc}
                  </p>
                </div>
              </div>

              {/* Equivalence Result Column */}
              <div className="md:col-span-7 space-y-3.5">
                <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-[#C5A267] block">
                  Calculated Co-Equivalents
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(systemMeta).map(([key, item]) => {
                    const isSrc = key === sourceSystem;
                    const convertedVal = getConvertedCredits(key);

                    return (
                      <div 
                        key={key} 
                        className={`p-4 rounded border transition-all ${
                          isSrc 
                            ? 'bg-[#C5A267]/5 border-[#C5A267]/30' 
                            : 'bg-[#1F1F23]/60 border-white/5 hover:border-[#C5A267]/10'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono font-bold text-[#A1A1AA] block tracking-wide truncate">
                          {item.name}
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <strong className={`font-mono text-2xl ${isSrc ? 'text-[#C5A267]' : 'text-[#F4F4F5]'}`}>
                            {convertedVal}
                          </strong>
                          <span className="font-mono text-[10px] text-[#A1A1AA] font-bold uppercase">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Practical Advice Banner */}
            <div className="bg-[#1F1F23] p-4 rounded border border-white/5 flex items-start gap-3">
              <Info className="h-5 w-5 text-[#C5A267] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono text-xs text-[#C5A267] uppercase block tracking-wider">
                  Important Registrar Note on Contact Hours
                </strong>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mt-1">
                  Credit conversion rules assume standard semester contact hours of 15-18 weeks. When applying course evaluations in clinical labs, vocational courses, or physical disciplines, registrars will look into direct lab/studio contact hours to perform strict audits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Content: Grading Scale Translator --- */}
        {activeSubTab === 'grading' && (
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-[#1F1F23]/40 border border-white/5 rounded text-xs text-[#A1A1AA] leading-relaxed">
              Convert GPAs, percent marks, and classifications between American, Nigerian NUC 5.0 systems, UK undergraduate benchmarks, and ECTS grades. Translate a grade in one system to instantly see mapped equivalents in other global templates.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Input Scale choice */}
              <div className="md:col-span-5 bg-[#1F1F23] p-5 rounded-lg border border-white/5 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A1A1AA] font-mono tracking-wider block mb-1.5">
                    Select Your Current Scale
                  </label>
                  <select
                    value={gradingSource}
                    onChange={(e) => {
                      setGradingSource(e.target.value);
                      setInputGrade(gradeSystemMeta[e.target.value].list[0].val);
                    }}
                    className="w-full bg-[#16161A] border border-white/10 rounded px-3 py-2 text-xs text-[#F4F4F5] font-serif focus:outline-none focus:border-[#C5A267]"
                  >
                    {Object.entries(gradeSystemMeta).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#A1A1AA] font-mono tracking-wider block mb-1.5">
                    Your Score / Grade Level
                  </label>
                  <select
                    value={inputGrade}
                    onChange={(e) => setInputGrade(e.target.value)}
                    className="w-full bg-[#16161A] border border-white/10 rounded px-3 py-2.5 text-xs text-[#C5A267] font-mono font-bold focus:outline-none focus:border-[#C5A267]"
                  >
                    {gradeSystemMeta[gradingSource].list.map((item) => (
                      <option key={item.val} value={item.val} className="font-mono">
                        {item.val} - {item.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#A1A1AA] mt-2 leading-relaxed">
                    Choose representative score marks inside your institution to evaluate foreign equivalency models.
                  </p>
                </div>
              </div>

              {/* Mapped results */}
              <div className="md:col-span-7 space-y-3.5">
                <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-[#C5A267] block">
                  Translated Benchmarks
                </span>

                <div className="space-y-2.5">
                  {Object.entries(gradeSystemMeta).map(([key, item]) => {
                    const isSrc = key === gradingSource;
                    const res = isSrc 
                      ? { val: inputGrade, label: gradeSystemMeta[gradingSource].list.find(g => g.val === inputGrade)?.label || '' }
                      : translateGrade(gradingSource, key, inputGrade);

                    return (
                      <div 
                        key={key} 
                        className={`p-3.5 rounded border flex items-center justify-between gap-4 transition-all ${
                          isSrc 
                            ? 'bg-[#C5A267]/5 border-[#C5A267]/30' 
                            : 'bg-[#1F1F23]/60 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono font-bold text-[#A1A1AA] uppercase block">
                            {item.name}
                          </span>
                          <span className={`text-xs mt-0.5 truncate block font-serif font-medium ${isSrc ? 'text-white' : 'text-[#E4E4E7]'}`}>
                            {res.label}
                          </span>
                        </div>
                        <div className="flex-shrink-0 text-right bg-[#16161A] border border-white/10 rounded px-3 py-1 font-mono text-sm font-bold text-[#C5A267]">
                          {res.val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Admission Equivalency Spotlight */}
            <div className="p-4 bg-[#1F1F23]/40 border border-white/5 rounded-lg flex items-start gap-3">
              <Award className="h-5 w-5 text-[#C5A267] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#A1A1AA] leading-relaxed">
                <strong className="font-mono text-[#C5A267] block mb-0.5 uppercase tracking-wider">Admission Eligibility Digest</strong>
                A Nigerian <strong className="text-white">First Class Honors</strong> (CGPA 4.50+) or Upper Second Class (CGPA 3.50 - 4.49) corresponds to a standard GPA of <strong className="text-white">3.00 - 4.00</strong> in the United States, representing a highly competitive profile for Ivy master's admissions, doctoral scholarships, and Direct Entry placement.
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Content: Nigeria Spotlight --- */}
        {activeSubTab === 'nigeria' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-3.5 bg-[#C5A267]/5 p-4 rounded border border-[#C5A267]/20">
              <Award className="h-6 w-6 text-[#C5A267] flex-shrink-0" />
              <div>
                <h4 className="font-serif text-[#F4F4F5] text-sm font-bold">Nigeria’s National Universities Commission (NUC) Guidelines</h4>
                <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                  The NUC coordinates university accreditation, benchmarks curricula (the BMAS / CCMAS guidelines), and sets core degree credit thresholds of around 120-160 credits total for standard four-year honors program completions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-[#1F1F23] p-5 rounded border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[#C5A267]">
                  <Layers className="h-4 w-4" />
                  <strong className="font-serif">The Credit Unit Definition</strong>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Under NUC bylaws, <strong className="text-[#E4E4E7]">1 Credit Unit</strong> represents 1 hourly slot of dry-run classroom lectures or 3 continuous hours of clinical laboratory/studio sessions per week throughout a standard 15-week academic semester.
                </p>
                <div className="bg-[#16161A] p-3 rounded text-[11px] border border-white/5 font-mono text-[#C5A267] leading-relaxed">
                  • 1 NUC Credit Unit = 1 US Semester Credit<br />
                  • 1 NUC Credit Unit = 2 European ECTS credits
                </div>
              </div>

              <div className="bg-[#1F1F23] p-5 rounded border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[#C5A267]">
                  <CheckCircle className="h-4 w-4" />
                  <strong className="font-serif">WES evaluation & Transcript Tips</strong>
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Applying from Nigeria for a course-by-course evaluation (e.g. via <strong className="text-white">World Education Services - WES</strong>)? Ensure your registrar files dynamic course syllabi.
                </p>
                <ul className="space-y-1 text-[#A1A1AA] list-inside leading-relaxed pl-1">
                  <li>• Submit original, sealed transcripts directly from your school.</li>
                  <li>• Ensure course descriptions clearly match credit units.</li>
                  <li>• Include NUC accreditation approval letters if requested.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="font-serif text-[#F4F4F5] text-sm font-semibold">Nigerian General Studies (GST) Highlight</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Nigerian universities mandate a series of <strong className="text-white">GST (General Studies)</strong> courses (such as Communication in English, Philosophy and Logic, Nigerian People and Culture) usually valued at 2 credits each. These map effectively to standard general education requirements like Writing Composition, Technical Communications, or Cultural Diversity in American or European degree audits! Select <span className="font-bold text-[#C5A267]">University of Lagos (UNILAG)</span> on the Syllabus Matcher tab to see a modeled simulation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
