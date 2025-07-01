import { Student, Professor, Match } from '../types';

// Enhanced LABYRINTH matching algorithm
export const calculateMatchScore = (student: Student, professor: Professor): number => {
  let score = 0;
  const weights = {
    researchAlignment: 0.35,
    skillsMatch: 0.25,
    academicLevel: 0.15,
    gpaConsideration: 0.10,
    availabilityFit: 0.15
  };

  // 1. Research Interest Alignment (35%)
  const commonInterests = student.researchInterests.filter(interest =>
    professor.researchAreas.some(area => 
      semanticSimilarity(interest, area) > 0.7
    )
  );
  const researchScore = Math.min(
    (commonInterests.length / Math.max(student.researchInterests.length, 1)) * 100,
    100
  );
  score += researchScore * weights.researchAlignment;

  // 2. Skills Match (25%)
  const matchedSkills = student.skills.filter(skill =>
    professor.requiredSkills.some(reqSkill =>
      semanticSimilarity(skill, reqSkill) > 0.8
    )
  );
  const skillsScore = Math.min(
    (matchedSkills.length / Math.max(professor.requiredSkills.length, 1)) * 100,
    100
  );
  score += skillsScore * weights.skillsMatch;

  // 3. Academic Level Compatibility (15%)
  const levelScore = professor.preferredStudentLevel.includes(student.year) ? 100 : 
                   getAcademicLevelCompatibility(student.year, professor.preferredStudentLevel);
  score += levelScore * weights.academicLevel;

  // 4. GPA Consideration (10%)
  const gpaScore = calculateGPAScore(student.gpa, professor.title);
  score += gpaScore * weights.gpaConsideration;

  // 5. Availability Fit (15%)
  const availabilityScore = calculateAvailabilityScore(student.availability, professor.mentorshipStyle);
  score += availabilityScore * weights.availabilityFit;

  return Math.min(score, 100);
};

// Semantic similarity for better matching
const semanticSimilarity = (str1: string, str2: string): number => {
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
  
  // Enhanced synonym matching
  const synonymMap: Record<string, string[]> = {
    'artificial intelligence': ['ai', 'machine learning', 'deep learning', 'neural networks'],
    'machine learning': ['ml', 'ai', 'artificial intelligence', 'data science'],
    'computer science': ['cs', 'computing', 'software engineering'],
    'data science': ['analytics', 'statistics', 'machine learning', 'big data'],
    'neuroscience': ['neural', 'brain', 'cognitive science', 'neuropsychology'],
    'robotics': ['autonomous systems', 'mechatronics', 'control systems'],
    'biology': ['biological', 'life sciences', 'biotechnology'],
    'physics': ['quantum', 'theoretical physics', 'applied physics'],
    'chemistry': ['biochemistry', 'chemical engineering', 'materials science'],
    'engineering': ['mechanical', 'electrical', 'civil', 'biomedical'],
    'python': ['programming', 'coding', 'software development'],
    'research': ['academic research', 'scientific research', 'investigation']
  };
  
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if ((s1.includes(key) && synonyms.some(syn => s2.includes(syn))) ||
        (s2.includes(key) && synonyms.some(syn => s1.includes(syn))) ||
        (synonyms.some(syn => s1.includes(syn)) && synonyms.some(syn => s2.includes(syn)))) {
      return 0.8;
    }
  }
  
  return 0.0;
};

const getAcademicLevelCompatibility = (studentYear: string, preferredLevels: string[]): number => {
  const levelHierarchy = {
    'Freshman': 1,
    'Sophomore': 2,
    'Junior': 3,
    'Senior': 4,
    'Graduate Student': 5,
    'PhD Student': 6
  };
  
  const studentLevel = levelHierarchy[studentYear as keyof typeof levelHierarchy] || 0;
  const preferredNums = preferredLevels.map(level => 
    levelHierarchy[level as keyof typeof levelHierarchy] || 0
  );
  
  const minDiff = Math.min(...preferredNums.map(level => Math.abs(studentLevel - level)));
  return Math.max(0, 100 - (minDiff * 15));
};

const calculateGPAScore = (gpa: number, professorTitle: string): number => {
  const expectations = {
    'Assistant Professor': 3.2,
    'Associate Professor': 3.4,
    'Professor': 3.5,
    'Research Professor': 3.3,
    'Clinical Professor': 3.1,
    'Lecturer': 3.0,
    'Senior Lecturer': 3.2,
    'Principal Investigator': 3.4
  };
  
  const expectedGPA = expectations[professorTitle as keyof typeof expectations] || 3.0;
  
  if (gpa >= expectedGPA + 0.3) return 100;
  if (gpa >= expectedGPA) return 85;
  if (gpa >= expectedGPA - 0.2) return 70;
  if (gpa >= expectedGPA - 0.4) return 50;
  return 30;
};

const calculateAvailabilityScore = (studentAvailability: string, mentorshipStyle: string): number => {
  const availabilityHours = {
    'Part-time (10-15 hours/week)': 12.5,
    'Part-time (15-20 hours/week)': 17.5,
    'Full-time (Summer only)': 40,
    'Full-time (Year-round)': 40
  };
  
  const hours = availabilityHours[studentAvailability as keyof typeof availabilityHours] || 15;
  const style = mentorshipStyle.toLowerCase();
  
  let requiredHours = 15;
  if (style.includes('hands-on') || style.includes('intensive')) requiredHours = 20;
  if (style.includes('collaborative')) requiredHours = 15;
  if (style.includes('independent')) requiredHours = 10;
  if (style.includes('structured')) requiredHours = 18;
  
  if (hours >= requiredHours) return 100;
  return Math.max(50, (hours / requiredHours) * 100);
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
      
      // Priority boost for interested students
      if (hasStudentInterest) {
        score = Math.min(score + 8, 100); // 8-point boost for showing interest
      }
      
      if (score > 25) { // Minimum threshold
        const commonInterests = student.researchInterests.filter(interest =>
          professor.researchAreas.some(area => 
            semanticSimilarity(interest, area) > 0.7
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

  // Sort by score (interested students will naturally rank higher due to boost)
  return matches.sort((a, b) => b.score - a.score);
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
    
    // Significant priority boost for interested students (professor perspective)
    if (isInterested) {
      score = Math.min(score + 15, 100); // 15-point boost for interested students
    }
    
    if (score > 25) {
      const commonInterests = student.researchInterests.filter(interest =>
        professor.researchAreas.some(area => 
          semanticSimilarity(interest, area) > 0.7
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

  // Sort by score - interested students will appear at the top
  return matches.sort((a, b) => b.score - a.score);
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

// LABYRINTH Analytics Functions
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
      contactedMatches: interests.filter((i: any) => i.status === 'contacted').length
    };
  } catch {
    return {
      totalStudents: 0,
      totalProfessors: 0,
      totalInterests: 0,
      activeMatches: 0,
      contactedMatches: 0
    };
  }
};