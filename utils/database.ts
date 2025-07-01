import { Student, Professor, Match } from '../types';

// Enhanced database structure for LABYRINTH
export interface LabyrinthDatabase {
  students: Student[];
  professors: Professor[];
  interests: InterestRecord[];
  matches: MatchRecord[];
  interactions: InteractionRecord[];
}

export interface InterestRecord {
  id: string;
  studentId: string;
  professorId: string;
  timestamp: Date;
  status: 'interested' | 'contacted' | 'matched' | 'declined';
}

export interface MatchRecord {
  id: string;
  studentId: string;
  professorId: string;
  score: number;
  commonInterests: string[];
  matchedSkills: string[];
  timestamp: Date;
  priority: number; // Higher for students who showed interest
}

export interface InteractionRecord {
  id: string;
  studentId: string;
  professorId: string;
  type: 'profile_view' | 'contact_sent' | 'interest_marked' | 'response_received';
  timestamp: Date;
  metadata?: any;
}

// Enhanced matching algorithm with two-way considerations
export class LabyrinthMatcher {
  
  // Calculate enhanced match score with priority boost for interested students
  static calculateEnhancedMatchScore(
    student: Student, 
    professor: Professor, 
    hasStudentInterest: boolean = false
  ): number {
    let score = 0;
    const weights = {
      researchAlignment: 0.35,
      skillsMatch: 0.25,
      academicLevel: 0.15,
      gpaConsideration: 0.10,
      availabilityFit: 0.10,
      interestBonus: 0.05  // Bonus for student interest
    };

    // 1. Research Interest Alignment (35%)
    const commonResearchInterests = student.researchInterests.filter(interest =>
      professor.researchAreas.some(area => 
        this.semanticSimilarity(interest, area) > 0.7
      )
    );
    const researchScore = Math.min(
      (commonResearchInterests.length / Math.max(student.researchInterests.length, 1)) * 100,
      100
    );
    score += researchScore * weights.researchAlignment;

    // 2. Skills Match (25%)
    const matchedSkills = student.skills.filter(skill =>
      professor.requiredSkills.some(reqSkill =>
        this.semanticSimilarity(skill, reqSkill) > 0.8
      )
    );
    const skillsScore = Math.min(
      (matchedSkills.length / Math.max(professor.requiredSkills.length, 1)) * 100,
      100
    );
    score += skillsScore * weights.skillsMatch;

    // 3. Academic Level Compatibility (15%)
    const levelScore = professor.preferredStudentLevel.includes(student.year) ? 100 : 
                     this.getAcademicLevelCompatibility(student.year, professor.preferredStudentLevel);
    score += levelScore * weights.academicLevel;

    // 4. GPA Consideration (10%)
    const gpaScore = this.calculateGPAScore(student.gpa, professor.title);
    score += gpaScore * weights.gpaConsideration;

    // 5. Availability Fit (10%)
    const availabilityScore = this.calculateAvailabilityScore(student.availability, professor.mentorshipStyle);
    score += availabilityScore * weights.availabilityFit;

    // 6. Interest Bonus (5%)
    if (hasStudentInterest) {
      score += 100 * weights.interestBonus;
    }

    return Math.min(score, 100);
  }

  // Semantic similarity checker for better matching
  private static semanticSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return 1.0;
    
    // Contains check
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    // Keyword overlap
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    if (commonWords.length > 0) {
      return 0.7 + (commonWords.length / Math.max(words1.length, words2.length)) * 0.2;
    }
    
    // Synonym/related terms (simplified)
    const synonymMap: Record<string, string[]> = {
      'ai': ['artificial intelligence', 'machine learning', 'deep learning'],
      'ml': ['machine learning', 'artificial intelligence'],
      'cs': ['computer science', 'computing'],
      'bio': ['biology', 'biological', 'life sciences'],
      'neuro': ['neuroscience', 'neural', 'brain'],
      'data': ['data science', 'analytics', 'statistics']
    };
    
    for (const [key, synonyms] of Object.entries(synonymMap)) {
      if ((s1.includes(key) && synonyms.some(syn => s2.includes(syn))) ||
          (s2.includes(key) && synonyms.some(syn => s1.includes(syn)))) {
        return 0.8;
      }
    }
    
    return 0.0;
  }

  private static getAcademicLevelCompatibility(studentYear: string, preferredLevels: string[]): number {
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
    
    // Calculate compatibility based on proximity
    const minDiff = Math.min(...preferredNums.map(level => Math.abs(studentLevel - level)));
    return Math.max(0, 100 - (minDiff * 20));
  }

  private static calculateGPAScore(gpa: number, professorTitle: string): number {
    // Higher expectations for higher-level professors
    const expectations = {
      'Assistant Professor': 3.2,
      'Associate Professor': 3.4,
      'Professor': 3.5,
      'Research Professor': 3.3
    };
    
    const expectedGPA = expectations[professorTitle as keyof typeof expectations] || 3.0;
    
    if (gpa >= expectedGPA + 0.3) return 100;
    if (gpa >= expectedGPA) return 85;
    if (gpa >= expectedGPA - 0.2) return 70;
    if (gpa >= expectedGPA - 0.4) return 50;
    return 30;
  }

  private static calculateAvailabilityScore(studentAvailability: string, mentorshipStyle: string): number {
    // Match availability with mentorship intensity
    const intensityMap = {
      'hands-on': 80,
      'collaborative': 60,
      'independent': 40,
      'structured': 70
    };
    
    const availabilityHours = {
      'Part-time (10-15 hours/week)': 12.5,
      'Part-time (15-20 hours/week)': 17.5,
      'Full-time (Summer only)': 40,
      'Full-time (Year-round)': 40
    };
    
    const hours = availabilityHours[studentAvailability as keyof typeof availabilityHours] || 15;
    const style = mentorshipStyle.toLowerCase();
    
    let requiredHours = 15; // default
    for (const [key, value] of Object.entries(intensityMap)) {
      if (style.includes(key)) {
        requiredHours = value / 4; // Convert to weekly hours
        break;
      }
    }
    
    if (hours >= requiredHours) return 100;
    return Math.max(50, (hours / requiredHours) * 100);
  }

  // Enhanced matching with priority for interested students
  static findEnhancedMatches(student: Student, professors: Professor[]): MatchRecord[] {
    const interests = this.getStudentInterests(student.id || '');
    const matches: MatchRecord[] = [];

    professors.forEach(professor => {
      if (professor.lookingForStudents) {
        const hasStudentInterest = interests.some(interest => 
          interest.professorId === professor.id && interest.status === 'interested'
        );
        
        const score = this.calculateEnhancedMatchScore(student, professor, hasStudentInterest);
        
        if (score > 25) { // Minimum threshold
          const commonInterests = student.researchInterests.filter(interest =>
            professor.researchAreas.some(area => 
              this.semanticSimilarity(interest, area) > 0.7
            )
          );
          
          const matchedSkills = student.skills.filter(skill =>
            professor.requiredSkills.some(reqSkill =>
              this.semanticSimilarity(skill, reqSkill) > 0.8
            )
          );
          
          const priority = hasStudentInterest ? score + 10 : score; // Boost for interest
          
          matches.push({
            id: `${student.id}-${professor.id}`,
            studentId: student.id || '',
            professorId: professor.id || '',
            score,
            commonInterests,
            matchedSkills,
            timestamp: new Date(),
            priority
          });
        }
      }
    });

    // Sort by priority (interested students get boosted to top)
    return matches.sort((a, b) => b.priority - a.priority);
  }

  // Get student interests from database
  private static getStudentInterests(studentId: string): InterestRecord[] {
    try {
      const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      return interests.filter((interest: InterestRecord) => interest.studentId === studentId);
    } catch {
      return [];
    }
  }

  // Database operations
  static saveInteraction(interaction: Omit<InteractionRecord, 'id'>): void {
    try {
      const interactions = JSON.parse(localStorage.getItem('labyrinth_interactions') || '[]');
      const newInteraction: InteractionRecord = {
        ...interaction,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      interactions.push(newInteraction);
      localStorage.setItem('labyrinth_interactions', JSON.stringify(interactions));
    } catch (error) {
      console.error('Error saving interaction:', error);
    }
  }

  static getStudentsByInterest(professorId: string): { student: Student, interestRecord: InterestRecord }[] {
    try {
      const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      const students = JSON.parse(localStorage.getItem('labyrinth_students') || '[]');
      
      const interestedStudents = interests
        .filter((interest: InterestRecord) => 
          interest.professorId === professorId && interest.status === 'interested'
        )
        .map((interest: InterestRecord) => {
          const student = students.find((s: Student) => s.id === interest.studentId);
          return student ? { student, interestRecord: interest } : null;
        })
        .filter(Boolean);
      
      return interestedStudents;
    } catch {
      return [];
    }
  }

  static updateMatchPriorities(professorId: string): void {
    try {
      const matches = JSON.parse(localStorage.getItem('labyrinth_matches') || '[]');
      const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      
      const updatedMatches = matches.map((match: MatchRecord) => {
        if (match.professorId === professorId) {
          const hasInterest = interests.some((interest: InterestRecord) =>
            interest.studentId === match.studentId && 
            interest.professorId === professorId &&
            interest.status === 'interested'
          );
          
          return {
            ...match,
            priority: hasInterest ? match.score + 10 : match.score
          };
        }
        return match;
      });
      
      localStorage.setItem('labyrinth_matches', JSON.stringify(updatedMatches));
    } catch (error) {
      console.error('Error updating match priorities:', error);
    }
  }
}

export default LabyrinthMatcher;