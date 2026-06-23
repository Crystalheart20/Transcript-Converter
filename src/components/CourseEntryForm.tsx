/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course, University } from '../types';
import { FileCode2, BookOpen, Plus, Sparkles, Check, RefreshCw } from 'lucide-react';
import { SAMPLE_COURSES } from '../data/sampleData';

interface CourseEntryFormProps {
  university: University;
  type: 'source' | 'target';
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}

export default function CourseEntryForm({
  university,
  type,
  selectedCourse,
  onSelectCourse,
}: CourseEntryFormProps) {
  const [usePreset, setUsePreset] = useState<boolean>(true);
  const [customCourse, setCustomCourse] = useState<Partial<Course>>({
    code: '',
    title: '',
    credits: 3,
    department: 'Computer Science',
    description: '',
    syllabusExcerpt: '',
  });

  const [customSuccessMessage, setCustomSuccessMessage] = useState<boolean>(false);

  const presets = SAMPLE_COURSES[university.id] || [];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCourse.code || !customCourse.title) return;

    const newCourse: Course = {
      id: `custom_${Date.now()}`,
      code: customCourse.code,
      title: customCourse.title,
      credits: Number(customCourse.credits) || 3,
      department: customCourse.department || 'General',
      description: customCourse.description || 'Custom course description.',
      syllabusExcerpt: customCourse.syllabusExcerpt || 'Custom syllabus outline details.',
    };

    onSelectCourse(newCourse);
    setCustomSuccessMessage(true);
    setTimeout(() => {
      setCustomSuccessMessage(false);
    }, 2500);
  };

  return (
    <div className="bg-[#16161A] rounded-xl border border-white/5 p-5 shadow-xl space-y-4" id={`course-entry-${type}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-semibold text-[#C5A267] tracking-[0.2em] uppercase">
            {type === 'source' ? 'Source' : 'Target'} Academics
          </span>
          <h4 className="font-serif text-[#F4F4F5] text-base mt-1 leading-snug">{university.name}</h4>
        </div>
        <div className="flex bg-[#1F1F23] p-1 rounded text-xs gap-1 border border-white/5">
          <button
            type="button"
            onClick={() => setUsePreset(true)}
            className={`px-3.5 py-1.5 rounded font-bold uppercase tracking-wider text-[10px] transition-all ${usePreset ? 'bg-[#C5A267] text-[#0A0A0B]' : 'text-[#A1A1AA] hover:text-[#F4F4F5]'}`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setUsePreset(false)}
            className={`px-3.5 py-1.5 rounded font-bold uppercase tracking-wider text-[10px] transition-all ${!usePreset ? 'bg-[#C5A267] text-[#0A0A0B]' : 'text-[#A1A1AA] hover:text-[#F4F4F5]'}`}
          >
            Custom
          </button>
        </div>
      </div>

      {usePreset ? (
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-[0.15em] font-mono">
            Choose Course from Syllabus Catalog
          </label>
          {presets.length === 0 ? (
            <div className="p-4 rounded bg-[#1F1F23] text-[#A1A1AA] text-center text-xs border border-dashed border-white/10">
              No preset courses available for this institution. Feel free to input a custom syllabus!
            </div>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {presets.map((course) => {
                const isSelected = selectedCourse?.code === course.code;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => onSelectCourse(course)}
                    className={`w-full text-left p-4 rounded border text-xs transition-all flex items-start gap-3 relative overflow-hidden ${
                      isSelected
                        ? 'border-[#C5A267] bg-[#1F1F23] ring-1 ring-[#C5A267]'
                        : 'border-white/5 hover:border-white/10 hover:bg-[#1F1F23] bg-[#16161A]'
                    }`}
                  >
                    <BookOpen className={`h-4 w-4 mt-1.5 flex-shrink-0 ${isSelected ? 'text-[#C5A267]' : 'text-[#A1A1AA]'}`} />
                    <div className="pr-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-[#C5A267] tracking-wider uppercase px-2 py-0.5 bg-[#1F1F23] border border-white/5 rounded">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#A1A1AA]">{course.credits} Credits</span>
                      </div>
                      <p className="font-serif text-[#F4F4F5] mt-2 text-sm leading-snug">{course.title}</p>
                      <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1.5">{course.description}</p>
                    </div>
                    {isSelected && (
                      <span className="absolute right-4 top-4 h-5 w-5 bg-[#C5A267] text-[#0A0A0B] rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1.5">
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Code</label>
              <input
                type="text"
                placeholder="CS 101"
                required
                value={customCourse.code}
                onChange={(e) => setCustomCourse({ ...customCourse, code: e.target.value })}
                className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none font-mono transition-all"
              />
            </div>
            <div className="col-span-1 space-y-1.5">
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Credits</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={customCourse.credits}
                onChange={(e) => setCustomCourse({ ...customCourse, credits: Number(e.target.value) })}
                className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none font-mono transition-all"
              />
            </div>
            <div className="col-span-1 space-y-1.5">
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Dept</label>
              <input
                type="text"
                placeholder="CIS"
                value={customCourse.department}
                onChange={(e) => setCustomCourse({ ...customCourse, department: e.target.value })}
                className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Title</label>
            <input
              type="text"
              placeholder="Software Automation Principles"
              required
              value={customCourse.title}
              onChange={(e) => setCustomCourse({ ...customCourse, title: e.target.value })}
              className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Catalog Description</label>
            <textarea
              rows={2}
              placeholder="Provide a general summary of the course and curriculum scopes..."
              required
              value={customCourse.description}
              onChange={(e) => setCustomCourse({ ...customCourse, description: e.target.value })}
              className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Syllabus Excerpt & Core Topics</label>
              <span className="text-[10px] text-[#C5A267] font-bold bg-[#C5A267]/10 px-2 py-0.5 rounded font-mono border border-[#C5A267]/30">Highly Recommended</span>
            </div>
            <textarea
              rows={3}
              placeholder="Paste specific topics, weekly schedules, learning objectives, or exam milestones from the syllabus to enable precise Gemini matching..."
              value={customCourse.syllabusExcerpt}
              onChange={(e) => setCustomCourse({ ...customCourse, syllabusExcerpt: e.target.value })}
              className="w-full text-xs p-3 rounded border border-white/10 bg-[#1F1F23] text-[#F4F4F5] focus:border-[#C5A267] outline-none transition-all resize-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C5A267] hover:brightness-110 text-[#0A0A0B] font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" /> Save Course & Map Syllabus
          </button>
          
          {customSuccessMessage && (
            <div className="p-3 bg-[#C5A267]/10 text-[#C5A267] text-xs font-semibold rounded flex items-center gap-2 border border-[#C5A267]/30">
              <Check className="h-4 w-4" /> Custom Course catalog syllabus saved! Ready for Match eval.
            </div>
          )}
        </form>
      )}

      {/* Selected Course summary card */}
      {selectedCourse && (
        <div className="mt-2 p-3 bg-[#1F1F23] border border-white/5 rounded relative overflow-hidden">
          <div className="flex items-start justify-between gap-1.5">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#C5A267] uppercase tracking-wider">Active Choice</p>
              <p className="text-sm font-serif text-[#F4F4F5] mt-1.5 leading-tight">
                {selectedCourse.code}: {selectedCourse.title}
              </p>
              <p className="text-xs text-[#A1A1AA] font-mono mt-1">{selectedCourse.credits} Credit Units</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/30 font-bold rounded flex-shrink-0">
              Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
