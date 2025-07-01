import { Student, Professor, Match } from '../types';

// Enhanced LABYRINTH matching algorithm with dynamic weights and improved scoring
export const calculateMatchScore = (student: Student, professor: Professor): number => {
  // Dynamic weight calculation based on professor preferences
  const weights = calculateDynamicWeights(professor);
  
  let score = 0;
  let componentScores = {
    researchAlignment: 0,
    skillsMatch: 0,
    academicLevel: 0,
    gpaConsideration: 0,
    availabilityFit: 0,
    experienceRelevance: 0,
    careerAlignment: 0
  };

  // 1. Enhanced Research Interest Alignment
  componentScores.researchAlignment = calculateResearchAlignment(student, professor);

  // 2. Enhanced Skills Match with proficiency levels
  componentScores.skillsMatch = calculateSkillsMatch(student, professor);

  // 3. Improved Academic Level Compatibility
  componentScores.academicLevel = calculateAcademicLevelCompatibility(student, professor);

  // 4. Contextual GPA Consideration
  componentScores.gpaConsideration = calculateContextualGPAScore(student, professor);

  // 5. Enhanced Availability Fit
  componentScores.availabilityFit = calculateEnhancedAvailabilityScore(student, professor);

  // 6. NEW: Experience Relevance
  componentScores.experienceRelevance = calculateExperienceRelevance(student, professor);

  // 7. NEW: Career Goals Alignment
  componentScores.careerAlignment = calculateCareerAlignment(student, professor);

  // Calculate weighted score
  score = Object.entries(componentScores).reduce((total, [key, value]) => {
    return total + (value * weights[key as keyof typeof weights]);
  }, 0);

  return Math.min(Math.max(score, 0), 100);
};

// Dynamic weight calculation based on professor characteristics
const calculateDynamicWeights = (professor: Professor) => {
  const baseWeights = {
    researchAlignment: 0.30,
    skillsMatch: 0.20,
    academicLevel: 0.15,
    gpaConsideration: 0.10,
    availabilityFit: 0.10,
    experienceRelevance: 0.10,
    careerAlignment: 0.05
  };

  // Adjust weights based on professor characteristics
  if (professor.title.includes('Research') || professor.title.includes('Principal Investigator')) {
    baseWeights.researchAlignment += 0.05;
    baseWeights.experienceRelevance += 0.05;
    baseWeights.skillsMatch -= 0.05;
    baseWeights.gpaConsideration -= 0.05;
  }

  if (professor.labSize > 10) {
    baseWeights.availabilityFit += 0.05;
    baseWeights.academicLevel -= 0.05;
  }

  if (professor.mentorshipStyle.includes('hands-on')) {
    baseWeights.skillsMatch += 0.05;
    baseWeights.availabilityFit += 0.05;
    baseWeights.researchAlignment -= 0.10;
  }

  // Normalize weights to sum to 1
  const totalWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0);
  Object.keys(baseWeights).forEach(key => {
    baseWeights[key as keyof typeof baseWeights] /= totalWeight;
  });

  return baseWeights;
};

// Enhanced research alignment with bidirectional matching
const calculateResearchAlignment = (student: Student, professor: Professor): number => {
  // Student interests matching professor areas
  const studentMatches = student.researchInterests.filter(interest =>
    professor.researchAreas.some(area => 
      enhancedSemanticSimilarity(interest, area) > 0.6
    )
  );

  // Professor areas matching student interests
  const professorMatches = professor.researchAreas.filter(area =>
    student.researchInterests.some(interest => 
      enhancedSemanticSimilarity(area, interest) > 0.6
    )
  );

  const studentScore = (studentMatches.length / Math.max(student.researchInterests.length, 1)) * 100;
  const professorScore = (professorMatches.length / Math.max(professor.researchAreas.length, 1)) * 100;

  // Weighted average favoring student interests slightly
  return (studentScore * 0.6) + (professorScore * 0.4);
};

// Enhanced skills matching with proficiency levels
const calculateSkillsMatch = (student: Student, professor: Professor): number => {
  const matchedSkills = student.skills.filter(skill =>
    professor.requiredSkills.some(reqSkill =>
      enhancedSemanticSimilarity(skill, reqSkill) > 0.7
    )
  );

  const missingSkills = professor.requiredSkills.filter(reqSkill =>
    !student.skills.some(skill =>
      enhancedSemanticSimilarity(skill, reqSkill) > 0.7
    )
  );

  const matchScore = (matchedSkills.length / Math.max(professor.requiredSkills.length, 1)) * 100;
  const penaltyScore = Math.max(0, 100 - (missingSkills.length * 10));

  return Math.min(matchScore, penaltyScore);
};

// Improved academic level compatibility with flexibility
const calculateAcademicLevelCompatibility = (student: Student, professor: Professor): number => {
  const levelHierarchy = {
    'Freshman': 1,
    'Sophomore': 2,
    'Junior': 3,
    'Senior': 4,
    'Graduate Student': 5,
    'PhD Student': 6
  };
  
  const studentLevel = levelHierarchy[student.year as keyof typeof levelHierarchy] || 0;
  const preferredLevels = professor.preferredStudentLevel.map(level => 
    levelHierarchy[level as keyof typeof levelHierarchy] || 0
  );
  
  // Perfect match
  if (preferredLevels.includes(studentLevel)) return 100;
  
  // Calculate distance to preferred levels
  const distances = preferredLevels.map(level => Math.abs(studentLevel - level));
  const minDistance = Math.min(...distances);
  
  // Flexible scoring based on distance
  if (minDistance === 1) return 85;
  if (minDistance === 2) return 70;
  if (minDistance === 3) return 50;
  return 30;
};

// Contextual GPA scoring based on field and professor preferences
const calculateContextualGPAScore = (student: Student, professor: Professor): number => {
  const fieldExpectations = {
    'Computer Science': { min: 3.2, good: 3.5, excellent: 3.8 },
    'Engineering': { min: 3.0, good: 3.3, excellent: 3.6 },
    'Biology': { min: 3.1, good: 3.4, excellent: 3.7 },
    'Physics': { min: 3.3, good: 3.6, excellent: 3.9 },
    'Psychology': { min: 3.0, good: 3.3, excellent: 3.6 },
    'default': { min: 3.0, good: 3.3, excellent: 3.6 }
  };

  const field = professor.department || 'default';
  const expectations = fieldExpectations[field as keyof typeof fieldExpectations] || fieldExpectations.default;

  if (student.gpa >= expectations.excellent) return 100;
  if (student.gpa >= expectations.good) return 85;
  if (student.gpa >= expectations.min) return 70;
  if (student.gpa >= expectations.min - 0.3) return 50;
  return 30;
};

// Enhanced availability scoring with mentorship style consideration
const calculateEnhancedAvailabilityScore = (student: Student, professor: Professor): number => {
  const availabilityHours = {
    'Part-time (10-15 hours/week)': 12.5,
    'Part-time (15-20 hours/week)': 17.5,
    'Full-time (Summer only)': 40,
    'Full-time (Year-round)': 40
  };
  
  const hours = availabilityHours[student.availability as keyof typeof availabilityHours] || 15;
  const style = professor.mentorshipStyle.toLowerCase();
  
  // More nuanced hour requirements based on mentorship style
  let requiredHours = 15;
  let flexibility = 0.8; // How flexible the professor is with hours
  
  if (style.includes('hands-on') || style.includes('intensive')) {
    requiredHours = 25;
    flexibility = 0.7;
  } else if (style.includes('collaborative')) {
    requiredHours = 20;
    flexibility = 0.8;
  } else if (style.includes('independent')) {
    requiredHours = 12;
    flexibility = 0.9;
  } else if (style.includes('structured')) {
    requiredHours = 18;
    flexibility = 0.75;
  }
  
  const ratio = hours / requiredHours;
  if (ratio >= 1) return 100;
  if (ratio >= flexibility) return 85;
  if (ratio >= 0.7) return 70;
  if (ratio >= 0.5) return 50;
  return 30;
};

// NEW: Experience relevance scoring
const calculateExperienceRelevance = (student: Student, professor: Professor): number => {
  if (!student.previousResearch && !student.experience) return 30;
  
  const experienceText = `${student.previousResearch} ${student.experience}`.toLowerCase();
  const researchAreas = professor.researchAreas.map(area => area.toLowerCase());
  
  let relevanceScore = 0;
  researchAreas.forEach(area => {
    if (experienceText.includes(area) || enhancedSemanticSimilarity(experienceText, area) > 0.5) {
      relevanceScore += 20;
    }
  });
  
  return Math.min(relevanceScore, 100);
};

// NEW: Career goals alignment
const calculateCareerAlignment = (student: Student, professor: Professor): number => {
  const careerText = student.careerGoals.toLowerCase();
  const researchAreas = professor.researchAreas.map(area => area.toLowerCase());
  
  let alignmentScore = 0;
  researchAreas.forEach(area => {
    if (careerText.includes(area) || enhancedSemanticSimilarity(careerText, area) > 0.6) {
      alignmentScore += 25;
    }
  });
  
  return Math.min(alignmentScore, 100);
};

// Enhanced semantic similarity with better synonym handling and context
const enhancedSemanticSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(word => words2.includes(word));
  
  if (commonWords.length > 0) {
    return 0.7 + (commonWords.length / Math.max(words1.length, words2.length)) * 0.2;
  }
  
  // Enhanced synonym mapping with categories
  const synonymMap: Record<string, string[]> = {
    // Computer Science
    'artificial intelligence': ['ai', 'machine learning', 'deep learning', 'neural networks', 'intelligent systems'],
    'machine learning': ['ml', 'ai', 'artificial intelligence', 'data science', 'predictive modeling'],
    'computer science': ['cs', 'computing', 'software engineering', 'programming'],
    'data science': ['analytics', 'statistics', 'machine learning', 'big data', 'data analytics'],
    'cybersecurity': ['security', 'information security', 'cyber security', 'network security'],
    'software engineering': ['software development', 'programming', 'coding', 'software architecture'],
    
    // Engineering
    'robotics': ['autonomous systems', 'mechatronics', 'control systems', 'automation'],
    'biomedical engineering': ['bioengineering', 'medical engineering', 'biotech'],
    'environmental engineering': ['environmental science', 'sustainability', 'green technology'],
    'materials science': ['materials engineering', 'nanomaterials', 'composite materials'],
    
    // Biology
    'neuroscience': ['neural', 'brain', 'cognitive science', 'neuropsychology', 'neurology'],
    'cancer research': ['oncology', 'cancer biology', 'tumor biology', 'cancer treatment'],
    'genetics': ['genomics', 'molecular biology', 'heredity', 'dna'],
    'biochemistry': ['molecular biology', 'chemical biology', 'biomolecular'],
    
    // Physics
    'quantum computing': ['quantum physics', 'quantum mechanics', 'quantum information'],
    'astrophysics': ['astronomy', 'cosmology', 'space science', 'stellar physics'],
    
    // Psychology
    'behavioral psychology': ['behavioral science', 'psychology', 'human behavior'],
    'cognitive science': ['cognitive psychology', 'brain science', 'mental processes'],
    
    // General
    'research': ['academic research', 'scientific research', 'investigation', 'study'],
    'python': ['programming', 'coding', 'software development', 'scripting'],
    'statistics': ['statistical analysis', 'data analysis', 'analytics'],
    'laboratory': ['lab', 'experimental', 'research lab', 'scientific lab']
  };
  
  // Check for synonym matches
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    const hasKey1 = s1.includes(key) || synonyms.some(syn => s1.includes(syn));
    const hasKey2 = s2.includes(key) || synonyms.some(syn => s2.includes(syn));
    
    if (hasKey1 && hasKey2) return 0.85;
    if (hasKey1 || hasKey2) {
      // Partial match - check if the other string has related terms
      const otherString = hasKey1 ? s2 : s1;
      const relatedTerms = [key, ...synonyms];
      if (relatedTerms.some(term => otherString.includes(term))) return 0.75;
    }
  }
  
  return 0.0;
};

export const findMatches = (student: Student, professors: Professor[]): Match[] => {
  const matches: Match[] = [];
  
  // Get student interests for priority boost
  const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
  const studentInterests = interests.filter((interest: any) => interest.studentId === student.id);

  professors.forEach(professor => {
    if (professor.lookingForStudents) {
      // Check if student marked interest in this professor
      const hasStudentInterest = studentInterests.some((interest: any) => 
        interest.professorId === professor.id && interest.status === 'interested'
      );
      
      let score = calculateMatchScore(student, professor);
      
      // Enhanced priority boost based on score level
      if (hasStudentInterest) {
        const boost = score >= 80 ? 5 : score >= 60 ? 8 : 12; // Higher boost for lower scores
        score = Math.min(score + boost, 100);
      }
      
      if (score > 20) { // Lowered minimum threshold for better inclusivity
        const commonInterests = student.researchInterests.filter(interest =>
          professor.researchAreas.some(area => 
            enhancedSemanticSimilarity(interest, area) > 0.6
          )
        );

        matches.push({
          id: `${student.id}-${professor.id}`,
          studentId: student.id || '',
          professorId: professor.id || '',
          score,
          commonInterests,
          student,
          professor,
          createdAt: new Date()
        });
      }
    }
  });

  // Enhanced sorting with tie-breaking
  return matches.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 2) {
      // If scores are very close, prioritize by common interests count
      return b.commonInterests.length - a.commonInterests.length;
    }
    return b.score - a.score;
  });
};

// Enhanced professor matching with priority for interested students
export const findStudentMatches = (professor: Professor, students: Student[]): Match[] => {
  const matches: Match[] = [];
  
  // Get interested students for this professor
  const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
  const interestedStudents = interests.filter((interest: any) => 
    interest.professorId === professor.id && interest.status === 'interested'
  );

  students.forEach(student => {
    const isInterested = interestedStudents.some((interest: any) => interest.studentId === student.id);
    
    let score = calculateMatchScore(student, professor);
    
    // Enhanced priority boost for interested students (professor perspective)
    if (isInterested) {
      const boost = score >= 85 ? 8 : score >= 70 ? 12 : 18; // Higher boost for lower scores
      score = Math.min(score + boost, 100);
    }
    
    if (score > 20) { // Lowered threshold for better inclusivity
      const commonInterests = student.researchInterests.filter(interest =>
        professor.researchAreas.some(area => 
          enhancedSemanticSimilarity(interest, area) > 0.6
        )
      );

      matches.push({
        id: `${student.id}-${professor.id}`,
        studentId: student.id || '',
        professorId: professor.id || '',
        score,
        commonInterests,
        student,
        professor,
        createdAt: new Date()
      });
    }
  });

  // Enhanced sorting with tie-breaking
  return matches.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 2) {
      // If scores are very close, prioritize by common interests count
      return b.commonInterests.length - a.commonInterests.length;
    }
    return b.score - a.score;
  });
};

export const formatScore = (score: number): string => {
  return `${Math.round(score)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
  if (score >= 70) return 'text-green-700 bg-green-100 border border-green-200';
  if (score >= 55) return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
  if (score >= 40) return 'text-orange-700 bg-orange-100 border border-orange-200';
  return 'text-red-700 bg-red-100 border border-red-200';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

// Enhanced LABYRINTH Analytics Functions
export const getMatchingAnalytics = () => {
  try {
    const students = JSON.parse(localStorage.getItem('labyrinth_students') || '[]');
    const professors = JSON.parse(localStorage.getItem('labyrinth_professors') || '[]');
    const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
    
    return {
      totalStudents: students.length,
      totalProfessors: professors.length,
      totalInterests: interests.length,
      activeMatches: interests.filter((i: any) => i.status === 'interested').length,
      contactedMatches: interests.filter((i: any) => i.status === 'contacted').length,
      averageMatchScore: calculateAverageMatchScore(students, professors),
      topResearchAreas: getTopResearchAreas(students, professors),
      skillGaps: analyzeSkillGaps(students, professors)
    };
  } catch {
    return {
      totalStudents: 0,
      totalProfessors: 0,
      totalInterests: 0,
      activeMatches: 0,
      contactedMatches: 0,
      averageMatchScore: 0,
      topResearchAreas: [],
      skillGaps: []
    };
  }
};

// NEW: Calculate average match score across all potential matches
const calculateAverageMatchScore = (students: Student[], professors: Professor[]): number => {
  if (students.length === 0 || professors.length === 0) return 0;
  
  let totalScore = 0;
  let matchCount = 0;
  
  students.forEach(student => {
    professors.forEach(professor => {
      if (professor.lookingForStudents) {
        const score = calculateMatchScore(student, professor);
        if (score > 20) {
          totalScore += score;
          matchCount++;
        }
      }
    });
  });
  
  return matchCount > 0 ? Math.round(totalScore / matchCount) : 0;
};

// NEW: Get top research areas by demand
const getTopResearchAreas = (students: Student[], professors: Professor[]): string[] => {
  const areaCount: Record<string, number> = {};
  
  // Count student interests
  students.forEach(student => {
    student.researchInterests.forEach(interest => {
      areaCount[interest] = (areaCount[interest] || 0) + 1;
    });
  });
  
  // Count professor areas (weighted by lab size)
  professors.forEach(professor => {
    professor.researchAreas.forEach(area => {
      areaCount[area] = (areaCount[area] || 0) + (professor.labSize || 1);
    });
  });
  
  return Object.entries(areaCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([area]) => area);
};

// NEW: Analyze skill gaps between student skills and professor requirements
const analyzeSkillGaps = (students: Student[], professors: Professor[]): string[] => {
  const requiredSkills: Record<string, number> = {};
  const availableSkills: Record<string, number> = {};
  
  // Count required skills
  professors.forEach(professor => {
    professor.requiredSkills.forEach(skill => {
      requiredSkills[skill] = (requiredSkills[skill] || 0) + 1;
    });
  });
  
  // Count available skills
  students.forEach(student => {
    student.skills.forEach(skill => {
      availableSkills[skill] = (availableSkills[skill] || 0) + 1;
    });
  });
  
  // Find gaps
  const gaps: string[] = [];
  Object.entries(requiredSkills).forEach(([skill, required]) => {
    const available = availableSkills[skill] || 0;
    if (required > available * 2) { // Significant gap
      gaps.push(skill);
    }
  });
  
  return gaps.slice(0, 5); // Top 5 gaps
};

// NEW: Debug function to analyze match components
export const debugMatchScore = (student: Student, professor: Professor) => {
  const weights = calculateDynamicWeights(professor);
  const components = {
    researchAlignment: calculateResearchAlignment(student, professor),
    skillsMatch: calculateSkillsMatch(student, professor),
    academicLevel: calculateAcademicLevelCompatibility(student, professor),
    gpaConsideration: calculateContextualGPAScore(student, professor),
    availabilityFit: calculateEnhancedAvailabilityScore(student, professor),
    experienceRelevance: calculateExperienceRelevance(student, professor),
    careerAlignment: calculateCareerAlignment(student, professor)
  };
  
  const weightedScore = Object.entries(components).reduce((total, [key, value]) => {
    return total + (value * weights[key as keyof typeof weights]);
  }, 0);
  
  return {
    components,
    weights,
    weightedScore: Math.min(Math.max(weightedScore, 0), 100),
    finalScore: calculateMatchScore(student, professor)
  };
};