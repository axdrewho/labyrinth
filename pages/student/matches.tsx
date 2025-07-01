import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Student, Professor, Match } from '../../types';
import { findMatches, formatScore, getScoreColor } from '../../utils';
import { 
  AcademicCapIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckBadgeIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface InterestRecord {
  studentId: string;
  professorId: string;
  timestamp: Date;
  status: 'interested' | 'contacted' | 'matched';
}

export default function StudentMatches() {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState<Student | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestedProfessors, setInterestedProfessors] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadStudentAndMatches();
      loadInterestData();
    }
  }, [id]);

  const loadInterestData = () => {
    try {
      const interests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      const studentInterests = interests
        .filter((interest: InterestRecord) => interest.studentId === id)
        .map((interest: InterestRecord) => interest.professorId);
      setInterestedProfessors(studentInterests);
    } catch (error) {
      console.error('Error loading interest data:', error);
    }
  };

  const handleInterested = (professorId: string) => {
    try {
      const existingInterests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      
      // Check if already interested
      const alreadyInterested = existingInterests.some(
        (interest: InterestRecord) => 
          interest.studentId === id && interest.professorId === professorId
      );

      if (alreadyInterested) {
        // Remove interest
        const updatedInterests = existingInterests.filter(
          (interest: InterestRecord) => 
            !(interest.studentId === id && interest.professorId === professorId)
        );
        localStorage.setItem('labyrinth_interests', JSON.stringify(updatedInterests));
        setInterestedProfessors(prev => prev.filter(pid => pid !== professorId));
      } else {
        // Add interest
        const newInterest: InterestRecord = {
          studentId: id as string,
          professorId,
          timestamp: new Date(),
          status: 'interested'
        };
        existingInterests.push(newInterest);
        localStorage.setItem('labyrinth_interests', JSON.stringify(existingInterests));
        setInterestedProfessors(prev => [...prev, professorId]);
      }
    } catch (error) {
      console.error('Error handling interest:', error);
    }
  };

  const loadStudentAndMatches = () => {
    try {
      const students = JSON.parse(localStorage.getItem('labyrinth_students') || '[]');
      const currentStudent = students.find((s: Student) => s.id === id);
      
      if (!currentStudent) {
        router.push('/student/onboarding');
        return;
      }

      let professors = JSON.parse(localStorage.getItem('labyrinth_professors') || '[]');
      
      if (professors.length === 0) {
        const mockProfessors: Professor[] = [
          {
            id: 'prof1',
            firstName: 'Dr. Sarah',
            lastName: 'Chen',
            email: 'sarah.chen@illinois.edu',
            phone: '(217) 555-0123',
            pronouns: 'She/Her/Hers',
            ethnicity: 'Asian or Pacific Islander (non-Hispanic or Latino)',
            university: 'University of Illinois at Urbana-Champaign',
            department: 'Computer Science',
            title: 'Associate Professor',
            researchAreas: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'],
            publications: ['Deep Learning for Medical Imaging', 'Neural Networks in Healthcare'],
            fundingHistory: 'NSF CAREER Award ($500K), NIH R01 ($1.2M), Google Research Grant ($150K)',
            labSize: 8,
            mentorshipStyle: 'Hands-on guidance with structured learning path',
            lookingForStudents: true,
            requiredSkills: ['Python', 'TensorFlow', 'Research Writing'],
            preferredStudentLevel: ['Junior', 'Senior', 'Graduate Student'],
            bio: 'Dr. Chen researches the intersection of AI and healthcare, focusing on computer vision applications for medical diagnosis. Her lab develops cutting-edge algorithms for automated medical image analysis.',
            websiteUrl: 'https://cs.illinois.edu/~schen',
            createdAt: new Date()
          },
          {
            id: 'prof2',
            firstName: 'Dr. Michael',
            lastName: 'Rodriguez',
            email: 'm.rodriguez@illinois.edu',
            phone: '(217) 555-0456',
            pronouns: 'He/Him/His',
            ethnicity: 'Hispanic or Latino',
            university: 'University of Illinois at Urbana-Champaign',
            department: 'Electrical Engineering',
            title: 'Professor',
            researchAreas: ['Robotics', 'Autonomous Systems', 'Machine Learning'],
            publications: ['Autonomous Navigation in Complex Environments', 'Robotic Learning Systems'],
            fundingHistory: 'DARPA grant ($2M), NSF grants ($800K), Toyota Research Institute ($1.5M)',
            labSize: 12,
            mentorshipStyle: 'Collaborative approach with independent research opportunities',
            lookingForStudents: true,
            requiredSkills: ['Python', 'C++', 'ROS', 'Machine Learning'],
            preferredStudentLevel: ['Senior', 'Graduate Student', 'PhD Student'],
            bio: 'Prof. Rodriguez leads research in autonomous robotics with applications in manufacturing and healthcare environments. His team focuses on real-world deployment of intelligent robotic systems.',
            websiteUrl: 'https://ece.illinois.edu/~mrodriguez',
            createdAt: new Date()
          },
          {
            id: 'prof3',
            firstName: 'Dr. Emily',
            lastName: 'Johnson',
            email: 'emily.johnson@illinois.edu',
            phone: '(217) 555-0789',
            pronouns: 'She/Her/Hers',
            ethnicity: 'White or Caucasian (Non-Hispanic or Latino)',
            university: 'University of Illinois at Urbana-Champaign',
            department: 'Biology',
            title: 'Assistant Professor',
            researchAreas: ['Neuroscience', 'Computational Biology', 'Machine Learning'],
            publications: ['Neural Network Models of Brain Function', 'Computational Approaches to Neuroscience'],
            fundingHistory: 'NIH K99/R00 Award ($750K), Simons Foundation Grant ($300K)',
            labSize: 5,
            mentorshipStyle: 'Structured learning with hands-on lab experience',
            lookingForStudents: true,
            requiredSkills: ['Python', 'MATLAB', 'Statistical Analysis', 'Research Writing'],
            preferredStudentLevel: ['Sophomore', 'Junior', 'Senior'],
            bio: 'Dr. Johnson combines computational methods with experimental neuroscience to understand brain function. Her research bridges theoretical models and practical applications in neural engineering.',
            websiteUrl: 'https://biology.illinois.edu/~ejohnson',
            createdAt: new Date()
          }
        ];
        
        localStorage.setItem('labyrinth_professors', JSON.stringify(mockProfessors));
        professors = mockProfessors;
      }

      const studentMatches = findMatches(currentStudent, professors);
      setMatches(studentMatches);
      setStudent(currentStudent);
      setLoading(false);
    } catch (error) {
      console.error('Error loading student data:', error);
      setLoading(false);
    }
  };

  const handleContact = (professor: Professor) => {
    try {
      // Update interest status to contacted
      const existingInterests = JSON.parse(localStorage.getItem('labyrinth_interests') || '[]');
      const updatedInterests = existingInterests.map((interest: InterestRecord) => {
        if (interest.studentId === id && interest.professorId === professor.id) {
          return { ...interest, status: 'contacted' };
        }
        return interest;
      });
      localStorage.setItem('labyrinth_interests', JSON.stringify(updatedInterests));

      const subject = encodeURIComponent(`Research Opportunity Inquiry from ${student?.firstName} ${student?.lastName} - LABYRINTH Platform`);
      const body = encodeURIComponent(`Dear Prof. ${professor.lastName},

I am ${student?.firstName} ${student?.lastName}, a ${student?.year} ${student?.major} student at ${student?.university}. I found your research profile through the LABYRINTH research matching platform and I'm very interested in your work in ${professor.researchAreas.slice(0, 2).join(' and ')}.

Based on our compatibility analysis, I believe my background in ${student?.skills.slice(0, 3).join(', ')} would be valuable to your research team. I would love to discuss potential research opportunities and learn more about your current projects.

My research interests include: ${student?.researchInterests.slice(0, 3).join(', ')}
My availability: ${student?.availability}

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${student?.firstName} ${student?.lastName}
${student?.email}
${student?.phone}

Via LABYRINTH - UIUC Research Platform`);

      window.open(`mailto:${professor.email}?subject=${subject}&body=${body}`);
    } catch (error) {
      console.error('Error handling contact:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-uiuc-orange border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Finding your perfect research matches...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-uiuc-blue to-uiuc-blue-light text-white px-3 py-1 rounded-lg font-bold text-sm">
                <SparklesIcon className="w-4 h-4 inline mr-1" />
                LABYRINTH
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Your Research Matches</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Profile Summary</h2>
            <SparklesIcon className="w-6 h-6 text-uiuc-orange" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {student.researchInterests.slice(0, 3).map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                    {interest}
                  </span>
                ))}
                {student.researchInterests.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-sm">
                    +{student.researchInterests.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Top Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Academic Info</h3>
              <p className="text-sm text-gray-600">
                {student.year} • {student.major}<br/>
                GPA: {student.gpa} • {student.university}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-uiuc-blue to-uiuc-orange mb-2">
                Your Research Matches ({matches.length})
              </h2>
              <p className="text-gray-600">
                Professors whose research aligns with your interests, ranked by compatibility
              </p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3">
                <div className="text-lg font-bold text-green-700">{interestedProfessors.length}</div>
                <div className="text-xs text-green-600">Interested</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8">
          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center border border-gray-200/50"
            >
              <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any professors that match your current interests and skills.
              </p>
              <button
                onClick={() => router.push('/student/onboarding')}
                className="bg-gradient-to-r from-uiuc-orange to-uiuc-orange-light text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                Update Your Profile
              </button>
            </motion.div>
          ) : (
            matches.map((match, index) => {
              const isInterested = interestedProfessors.includes(match.professor.id || '');
              
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 overflow-hidden"
                >
                  <div className="p-8">
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-uiuc-orange to-uiuc-orange-light rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {match.professor.firstName.charAt(0)}{match.professor.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {match.professor.firstName} {match.professor.lastName}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {match.professor.title} • {match.professor.department}
                          </p>
                          <p className="text-gray-500 text-sm">{match.professor.university}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getScoreColor(match.score)}`}>
                          <StarIcon className="w-4 h-4 mr-1" />
                          {formatScore(match.score)} Match
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInterested(match.professor.id || '')}
                          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            isInterested
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                          }`}
                        >
                          {isInterested ? (
                            <HeartSolidIcon className="w-4 h-4 mr-1" />
                          ) : (
                            <HeartIcon className="w-4 h-4 mr-1" />
                          )}
                          {isInterested ? 'Interested ✓' : 'Mark Interested'}
                        </motion.button>
                      </div>
                    </div>

                    {/* Professor Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      <div className="lg:col-span-2 space-y-6">
                        {/* Research Areas */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-2 text-uiuc-orange" />
                            Research Areas & Common Interests
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {match.professor.researchAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                  match.commonInterests.includes(area)
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300 shadow-sm'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                              >
                                {area}
                                {match.commonInterests.includes(area) && ' ✨'}
                              </span>
                            ))}
                          </div>
                          {match.commonInterests.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                              <p className="text-green-800 font-medium text-sm">
                                🎯 {match.commonInterests.length} shared research interest{match.commonInterests.length > 1 ? 's' : ''}: {match.commonInterests.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* About */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">About the Research</h4>
                          <p className="text-gray-700 leading-relaxed">
                            {match.professor.bio}
                          </p>
                        </div>

                        {/* Publications */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Recent Publications</h4>
                          <ul className="space-y-1">
                            {match.professor.publications.slice(0, 2).map((pub, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600">
                                <span className="text-uiuc-orange mr-2 mt-1">📄</span>
                                <span className="italic">{pub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <EnvelopeIcon className="w-4 h-4 mr-2" />
                              {match.professor.email}
                            </div>
                            {match.professor.websiteUrl && (
                              <div className="flex items-center text-gray-600">
                                <GlobeAltIcon className="w-4 h-4 mr-2" />
                                <a 
                                  href={match.professor.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-uiuc-blue hover:text-uiuc-blue-light transition-colors"
                                >
                                  Research Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lab Info */}
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <h4 className="font-bold text-gray-900 mb-3">Lab Information</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Team Size:</strong> {match.professor.labSize} members</p>
                            <p><strong>Seeking:</strong> {match.professor.preferredStudentLevel.join(', ')}</p>
                            <p><strong>Status:</strong> 
                              <span className={match.professor.lookingForStudents ? 'text-green-600 font-medium' : 'text-red-600'}>
                                {match.professor.lookingForStudents ? ' Accepting Students ✅' : ' Not Currently Accepting'}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Required Skills */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {match.professor.requiredSkills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  student.skills.includes(skill)
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {skill}
                                {student.skills.includes(skill) && ' ✓'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleContact(match.professor)}
                        className="flex-1 bg-gradient-to-r from-uiuc-orange to-uiuc-orange-light text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                        Contact Professor
                      </motion.button>
                      
                      {match.professor.websiteUrl && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.open(match.professor.websiteUrl, '_blank')}
                          className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                          <GlobeAltIcon className="w-5 h-5 mr-2" />
                          View Research
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-uiuc-blue/10 to-uiuc-orange/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to discover more matches?
            </h3>
            <p className="text-gray-600 mb-6">
              Update your profile with additional skills, research interests, or experience to unlock more opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/student/onboarding')}
                className="bg-gradient-to-r from-uiuc-orange to-uiuc-orange-light text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                ✨ Enhance Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:border-gray-300 transition-all duration-300"
              >
                🔄 Refresh Matches
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}