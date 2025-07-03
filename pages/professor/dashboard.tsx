import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Student, Professor, Match } from '../../types';
import { findMatches, formatScore, getScoreColor } from '../../utils';
import { 
  AcademicCapIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  UserGroupIcon,
  SparklesIcon,
  CheckBadgeIcon,
  TrophyIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function ProfessorDashboard() {
  const router = useRouter();
  const { id } = router.query;
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [potentialStudents, setPotentialStudents] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProfessorAndStudents();
    }
  }, [id]);

  const loadProfessorAndStudents = () => {
    try {
      // Get professor data
      const professors = JSON.parse(localStorage.getItem('labyrinth_professors') || '[]');
      const currentProfessor = professors.find((p: Professor) => p.id === id);
      
      if (!currentProfessor) {
        router.push('/professor/onboarding');
        return;
      }

      // Get students data
      const students = JSON.parse(localStorage.getItem('labyrinth_students') || '[]');
      
      // Add some mock students if none exist
      if (students.length === 0) {
        const mockStudents: Student[] = [
          {
            id: 'student1',
            firstName: 'Alex',
            lastName: 'Chen',
            email: 'alex.chen@stanford.edu',
            phone: '(650) 555-0123',
            pronouns: 'They/Them/Theirs',
            ethnicity: 'Asian or Pacific Islander (non-Hispanic or Latino)',
            university: 'Stanford University',
            major: 'Computer Science',
            year: 'Junior',
            gpa: 3.8,
            researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing'],
            skills: ['Python', 'TensorFlow', 'Research Writing', 'Statistical Analysis'],
            experience: 'Software engineering intern at Google, coursework in ML and AI, personal projects in NLP',
            previousResearch: 'Worked on sentiment analysis project, published paper at undergraduate conference',
            careerGoals: 'PhD in AI/ML, research career in academia or industry research lab',
            availability: 'Part-time (15-20 hours/week)',
            preferredMentorshipStyle: 'Hands-on guidance',
            createdAt: new Date()
          },
          {
            id: 'student2',
            firstName: 'Maria',
            lastName: 'Rodriguez',
            email: 'maria.rodriguez@mit.edu',
            phone: '(617) 555-0456',
            pronouns: 'She/Her/Hers',
            ethnicity: 'Hispanic or Latino',
            university: 'MIT',
            major: 'Electrical Engineering',
            year: 'Senior',
            gpa: 3.9,
            researchInterests: ['Robotics', 'Computer Vision', 'Autonomous Systems'],
            skills: ['Python', 'C++', 'ROS', 'Computer Vision', 'Machine Learning'],
            experience: 'Robotics team captain, internships at Tesla and Boston Dynamics, strong background in control systems',
            previousResearch: 'Autonomous drone navigation project, winner of IEEE robotics competition',
            careerGoals: 'Graduate school in robotics, career in autonomous vehicle development',
            availability: 'Full-time (Summer only)',
            preferredMentorshipStyle: 'Collaborative approach',
            createdAt: new Date()
          },
          {
            id: 'student3',
            firstName: 'Jamie',
            lastName: 'Thompson',
            email: 'jamie.thompson@caltech.edu',
            phone: '(626) 555-0789',
            pronouns: 'He/Him/His',
            ethnicity: 'White or Caucasian (Non-Hispanic or Latino)',
            university: 'Caltech',
            major: 'Biology',
            year: 'Sophomore',
            gpa: 3.7,
            researchInterests: ['Neuroscience', 'Computational Biology', 'Data Science'],
            skills: ['Python', 'MATLAB', 'R', 'Statistical Analysis', 'Laboratory Techniques'],
            experience: 'Research assistant in neuroscience lab, coursework in computational biology and statistics',
            previousResearch: 'Analysis of neural spike data, presentation at undergraduate research symposium',
            careerGoals: 'MD/PhD program, career in computational neuroscience research',
            availability: 'Part-time (10-15 hours/week)',
            preferredMentorshipStyle: 'Structured learning path',
            createdAt: new Date()
          },
          {
            id: 'student4',
            firstName: 'David',
            lastName: 'Kim',
            email: 'david.kim@berkeley.edu',
            phone: '(510) 555-0321',
            pronouns: 'He/Him/His',
            ethnicity: 'Asian or Pacific Islander (non-Hispanic or Latino)',
            university: 'UC Berkeley',
            major: 'Computer Science',
            year: 'Graduate',
            gpa: 3.6,
            researchInterests: ['Machine Learning', 'Data Science', 'Artificial Intelligence'],
            skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Data Visualization'],
            experience: 'Data scientist at startup, MS in Computer Science, strong mathematical background',
            previousResearch: 'Multiple publications in ML conferences, thesis on deep learning optimization',
            careerGoals: 'PhD in machine learning, research scientist position at top tech company',
            availability: 'Full-time (Year-round)',
            preferredMentorshipStyle: 'Independent work with check-ins',
            createdAt: new Date()
          }
        ];
        
        localStorage.setItem('labyrinth_students', JSON.stringify(mockStudents));
        
        // Find potential matches with mock students
        const studentMatches = mockStudents.map(student => {
          const match = findMatches(student, [currentProfessor])[0];
          return match ? {
            ...match,
            id: `${student.id}-${currentProfessor.id}`,
            studentId: student.id,
            professorId: currentProfessor.id || '',
            student,
            professor: currentProfessor
          } : null;
        }).filter(Boolean) as Match[];
        
        setPotentialStudents(studentMatches.sort((a, b) => b.score - a.score));
      } else {
        // Find matches with existing students
        const studentMatches = students.map((student: Student) => {
          const match = findMatches(student, [currentProfessor])[0];
          return match ? {
            ...match,
            id: `${student.id}-${currentProfessor.id}`,
            studentId: student.id || '',
            professorId: currentProfessor.id || '',
            student,
            professor: currentProfessor
          } : null;
        }).filter(Boolean) as Match[];
        
        setPotentialStudents(studentMatches.sort((a, b) => b.score - a.score));
      }

      setProfessor(currentProfessor);
      setLoading(false);
    } catch (error) {
      console.error('Error loading professor data:', error);
      setLoading(false);
    }
  };

  const handleContact = (student: Student) => {
    // In a real app, this would open a contact form or messaging system
    const subject = encodeURIComponent(`Research Opportunity in ${professor?.researchAreas.slice(0, 2).join(' and ')}`);
    const body = encodeURIComponent(`Dear ${student.firstName},

I am Prof. ${professor?.lastName} from the ${professor?.department} department at ${professor?.university}. I reviewed your profile and I'm impressed with your background in ${student.skills.slice(0, 3).join(', ')} and your interest in ${student.researchInterests.slice(0, 2).join(' and ')}.

I believe you would be an excellent fit for my research team working on ${professor?.researchAreas.slice(0, 2).join(' and ')}. I would like to discuss potential research opportunities with you.

Please let me know if you're interested in setting up a meeting to discuss this further.

Best regards,
Prof. ${professor?.firstName} ${professor?.lastName}
${professor?.department}
${professor?.university}
${professor?.email}`);

    window.open(`mailto:${student.email}?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Professor not found</p>
        </div>
      </div>
    );
  }

  const highQualityMatches = potentialStudents.filter(match => match.score >= 60);
  const averageMatchScore = potentialStudents.length > 0 
    ? potentialStudents.reduce((sum, match) => sum + match.score, 0) / potentialStudents.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-uiuc-blue text-white px-3 py-1 rounded-lg font-bold text-sm">
                UIUC RESEARCH
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Professor Dashboard</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">Prof. {professor.firstName} {professor.lastName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professor Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Research Profile</h2>
            <SparklesIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {professor.researchAreas.slice(0, 3).map((area, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-lg text-sm">
                    {area}
                  </span>
                ))}
                {professor.researchAreas.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-sm">
                    +{professor.researchAreas.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {professor.requiredSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Lab Information</h3>
              <p className="text-sm text-gray-600">
                Current size: {professor.labSize} members<br/>
                Seeking: {professor.preferredStudentLevel.join(', ')}<br/>
                Status: {professor.lookingForStudents ? 'Accepting students' : 'Not currently accepting'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{potentialStudents.length}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Quality Matches</p>
                <p className="text-2xl font-bold text-gray-900">{highQualityMatches.length}</p>
              </div>
              <TrophyIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageMatchScore)}%</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Potential Students Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Potential Students ({potentialStudents.length})
          </h2>
          <p className="text-gray-600">
            Students whose interests and skills align with your research areas, ranked by compatibility.
          </p>
        </motion.div>

        {/* Students Grid */}
        <div className="grid gap-6">
          {potentialStudents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No student matches found</h3>
              <p className="text-gray-600 mb-4">
                There are currently no students that match your research areas and requirements.
              </p>
              <button
                onClick={() => router.push('/professor/onboarding')}
                className="bg-uiuc-orange text-white px-6 py-3 rounded-lg hover:bg-uiuc-orange-dark transition-colors"
              >
                Update Your Profile
              </button>
            </motion.div>
          ) : (
            potentialStudents.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Match Score Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {match.student.firstName.charAt(0)}{match.student.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {match.student.firstName} {match.student.lastName}
                        </h3>
                        <p className="text-gray-600">
                          {match.student.year} • {match.student.major} • {match.student.university}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-black ${getScoreColor(match.score)}`}>
                        <CheckBadgeIcon className="w-4 h-4 mr-1" />
                        {formatScore(match.score)} Match
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Academic Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <AcademicCapIcon className="w-4 h-4 mr-2" />
                          GPA: {match.student.gpa} / 4.0
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          {match.student.email}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {match.student.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Availability & Preferences</h4>
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">Availability: {match.student.availability}</p>
                        <p className="mb-1">Mentorship style: {match.student.preferredMentorshipStyle}</p>
                        <p>Pronouns: {match.student.pronouns}</p>
                      </div>
                    </div>
                  </div>

                  {/* Research Interests & Common Areas */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Research Interests & Common Areas</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {match.student.researchInterests.map((interest, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            match.commonInterests.includes(interest)
                              ? 'bg-green-100 text-green-800 font-medium'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {interest}
                          {match.commonInterests.includes(interest) && ' ✓'}
                        </span>
                      ))}
                    </div>
                    {match.commonInterests.length > 0 && (
                      <p className="text-sm text-green-700 font-medium">
                        {match.commonInterests.length} common research area{match.commonInterests.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.student.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-lg text-sm ${
                            professor.requiredSkills.includes(skill)
                              ? 'bg-blue-100 text-blue-800 font-medium'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                          {professor.requiredSkills.includes(skill) && ' ✓'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {match.student.experience}
                    </p>
                    {match.student.previousResearch && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1 text-sm">Previous Research:</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {match.student.previousResearch}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Career Goals */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Career Goals</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {match.student.careerGoals}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center items-center space-x-6 mt-16">
                    <button
                      onClick={() => handleContact(match.student)}
                      className="flex-1 bg-uiuc-orange text-white px-6 py-3 rounded-lg hover:bg-uiuc-orange-dark transition-colors font-medium"
                    >
                      <EnvelopeIcon className="w-5 h-5 inline mr-2" />
                      Contact Student
                    </button>
                    <button
                      onClick={() => window.open(`tel:${match.student.phone}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <PhoneIcon className="w-5 h-5 inline mr-2" />
                      Call Student
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Want to attract more qualified students?
            </h3>
            <p className="text-gray-600 mb-6">
              Update your profile with more research areas, required skills, or preferences to get better matches.
            </p>
            <button
              onClick={() => router.push('/professor/onboarding')}
              className="bg-uiuc-orange text-white px-8 py-3 rounded-lg hover:bg-uiuc-orange-dark transition-colors font-medium"
            >
              Update Profile
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}