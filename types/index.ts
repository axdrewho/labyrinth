export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pronouns: string;
  ethnicity: string;
  university: string;
  major: string;
  year: string;
  gpa: number;
  researchInterests: string[];
  skills: string[];
  experience: string;
  previousResearch: string;
  careerGoals: string;
  availability: string;
  preferredMentorshipStyle: string;
  createdAt?: Date;
}

export interface Professor {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pronouns: string;
  ethnicity: string;
  university: string;
  department: string;
  title: string;
  researchAreas: string[];
  publications: string[];
  fundingHistory: string;
  labSize: number;
  mentorshipStyle: string;
  lookingForStudents: boolean;
  requiredSkills: string[];
  preferredStudentLevel: string[];
  bio: string;
  websiteUrl?: string;
  createdAt?: Date;
}

export interface Match {
  id: string;
  studentId: string;
  professorId: string;
  score: number;
  commonInterests: string[];
  student: Student;
  professor: Professor;
  createdAt: Date;
}

export interface ResearchArea {
  id: string;
  name: string;
  category: string;
}

export const RESEARCH_AREAS: ResearchArea[] = [
  { id: '1', name: 'Artificial Intelligence', category: 'Computer Science' },
  { id: '2', name: 'Machine Learning', category: 'Computer Science' },
  { id: '3', name: 'Data Science', category: 'Computer Science' },
  { id: '4', name: 'Cybersecurity', category: 'Computer Science' },
  { id: '5', name: 'Software Engineering', category: 'Computer Science' },
  { id: '6', name: 'Human-Computer Interaction', category: 'Computer Science' },
  { id: '7', name: 'Computer Vision', category: 'Computer Science' },
  { id: '8', name: 'Natural Language Processing', category: 'Computer Science' },
  { id: '9', name: 'Robotics', category: 'Engineering' },
  { id: '10', name: 'Biomedical Engineering', category: 'Engineering' },
  { id: '11', name: 'Environmental Engineering', category: 'Engineering' },
  { id: '12', name: 'Materials Science', category: 'Engineering' },
  { id: '13', name: 'Cancer Research', category: 'Biology' },
  { id: '14', name: 'Genetics', category: 'Biology' },
  { id: '15', name: 'Neuroscience', category: 'Biology' },
  { id: '16', name: 'Biochemistry', category: 'Biology' },
  { id: '17', name: 'Climate Change', category: 'Environmental Science' },
  { id: '18', name: 'Renewable Energy', category: 'Environmental Science' },
  { id: '19', name: 'Quantum Computing', category: 'Physics' },
  { id: '20', name: 'Astrophysics', category: 'Physics' },
  { id: '21', name: 'Behavioral Psychology', category: 'Psychology' },
  { id: '22', name: 'Cognitive Science', category: 'Psychology' },
  { id: '23', name: 'Economics', category: 'Social Sciences' },
  { id: '24', name: 'Political Science', category: 'Social Sciences' },
];

export const SKILLS = [
  'Python', 'R', 'JavaScript', 'Java', 'C++', 'MATLAB', 'SQL',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
  'Git', 'Docker', 'AWS', 'Azure', 'Linux', 'Statistical Analysis',
  'Data Visualization', 'Research Writing', 'Laboratory Techniques',
  'Project Management', 'Team Leadership', 'Public Speaking'
];