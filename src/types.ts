/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface University {
  id: string;
  name: string;
  location: string;
  color: string; // Tailwind color theme (e.g. 'indigo', 'emerald')
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  description: string;
  syllabusExcerpt?: string;
  department: string;
}

export interface DegreeRequirement {
  id: string;
  category: 'major_core' | 'major_elective' | 'general_education' | 'free_elective';
  title: string;
  requiredCredits: number;
  mappedCourses: string[]; // target course codes mapped
}

export interface DegreeProgram {
  id: string;
  name: string;
  universityId: string;
  totalCreditsRequired: number;
  requirements: DegreeRequirement[];
  courses: Course[];
}

export interface EvaluationResult {
  sourceCourseCode: string;
  sourceCourseTitle: string;
  targetCourseCode: string;
  targetCourseTitle: string;
  matchScore: number; // 0 to 100
  status: 'equivalent' | 'half_equivalent' | 'not_equivalent';
  rationale: string;
  creditRecommendation: number;
  targetRequirementCategory: 'major_core' | 'major_elective' | 'general_education' | 'free_elective' | 'none';
  suggestedLevel: 'lower_division' | 'upper_division';
  evaluationDate: string;
  keyTopicsMatched: string[];
  missingTopics: string[];
}

export interface ProgramMapping {
  id: string;
  sourceUniversity: University;
  targetUniversity: University;
  sourceProgramName: string;
  targetProgramName: string;
  overallMatchScore: number;
  evaluations: EvaluationResult[];
  totalSourceCreditsAttempted: number;
  totalCreditsTransferred: number;
  fulfillment: {
    category: 'major_core' | 'major_elective' | 'general_education' | 'free_elective';
    required: number;
    fulfilled: number;
  }[];
  generatedAt: string;
}
