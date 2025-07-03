import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Professor, RESEARCH_AREAS, SKILLS } from '../../types';
import { validateEmail, validatePhone, formatPhone } from '../../utils';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const sections = [
  {
    id: 'personal',
    title: 'Personal Information',
    subtitle: 'Tell us about yourself',
    fields: ['firstName', 'lastName', 'email', 'phone', 'pronouns', 'ethnicity']
  },
  {
    id: 'academic',
    title: 'Academic Profile',
    subtitle: 'Your professional background',
    fields: ['university', 'department', 'title', 'bio']
  },
  {
    id: 'research',
    title: 'Research & Expertise',
    subtitle: 'Your research focus and areas',
    fields: ['researchAreas', 'requiredSkills', /*'fundingHistory',*/ 'labSize']
  },
  {
    id: 'mentorship',
    title: 'Mentorship Preferences',
    subtitle: 'How you work with students',
    fields: ['mentorshipStyle', 'preferredStudentLevel', 'lookingForStudents']
  }
];

const ProfessorOnboarding: React.FC = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalFields = sections.reduce((acc, section) => acc + section.fields.length, 0);
  const completedFields = Object.keys(answers).filter(key => {
    const value = answers[key];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;
  const progress = (completedFields / totalFields) * 100;

  const handleInputChange = (field: string, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, sectionIndex: number) => {
    if (e.key === 'Enter' && sectionIndex < sections.length - 1) {
      const nextSection = sectionIndex + 1;
      setCurrentSection(nextSection);
      sectionRefs.current[nextSection]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const validateSection = (sectionIndex: number): boolean => {
    const section = sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      const value = answers[field];
      
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }

      if (field === 'email' && value && !validateEmail(value)) {
        newErrors[field] = 'Invalid email format';
        isValid = false;
      }

      if (field === 'phone' && value && !validatePhone(value)) {
        newErrors[field] = 'Invalid phone format';
        isValid = false;
      }

      if (field === 'labSize' && value && (value < 0 || value > 100)) {
        newErrors[field] = 'Please enter a valid team size (0-100)';
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    if (isValid && !completedSections.includes(sectionIndex)) {
      setCompletedSections(prev => [...prev, sectionIndex]);
    }

    return isValid;
  };

  const handleSubmit = async () => {
    const allSectionsValid = sections.every((_, index) => validateSection(index));
    
    if (!allSectionsValid) {
      return;
    }

    try {
      const professorData: Professor = {
        id: Date.now().toString(),
        firstName: answers.firstName,
        lastName: answers.lastName,
        email: answers.email,
        phone: answers.phone,
        pronouns: answers.pronouns,
        ethnicity: answers.ethnicity,
        university: answers.university,
        department: answers.department,
        title: answers.title,
        bio: answers.bio,
        researchAreas: answers.researchAreas || [],
        publications: [],
        /*fundingHistory: answers.fundingHistory,*/
        labSize: parseInt(answers.labSize) || 0,
        mentorshipStyle: answers.mentorshipStyle,
        lookingForStudents: answers.lookingForStudents === 'Yes, I am actively seeking students',
        requiredSkills: answers.requiredSkills || [],
        preferredStudentLevel: answers.preferredStudentLevel || [],
        websiteUrl: '',
        createdAt: new Date()
      };

      if (typeof window !== 'undefined') {
        const existingProfessors = JSON.parse(localStorage.getItem('labyrinth_professors') || '[]');
        existingProfessors.push(professorData);
        localStorage.setItem('labyrinth_professors', JSON.stringify(existingProfessors));
      }
      
      router.push(`/professor/dashboard?id=${professorData.id}`);
    } catch (error) {
      console.error('Error saving professor data:', error);
    }
  };

  const renderField = (field: string, sectionIndex: number) => {
    const value = answers[field];
    const error = errors[field];

    switch (field) {
      case 'firstName':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">First Name *</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="Enter your first name"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'lastName':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 ">Last Name *</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="Enter your last name"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Email Address *</label>
            <input
              type="email"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="your.email@illinois.edu"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Phone Number *</label>
            <input
              type="tel"
              value={value || ''}
              onChange={(e) => handleInputChange(field, formatPhone(e.target.value))}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="(217) 555-0123"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'pronouns':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Pronouns *</label>
            <div className="grid grid-cols-2 gap-3">
              {['He/Him/His', 'She/Her/Hers', 'They/Them/Theirs', 'Other'].map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    value === option 
                      ? 'border-uiuc-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="pronouns"
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    value === option ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {value === option && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'ethnicity':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Ethnic Background *</label>
            <div className="space-y-2">
              {[
                'Asian or Pacific Islander (non-Hispanic or Latino)',
                'Black or African-American/International (non-Hispanic or Latino)',
                'Hispanic or Latino',
                'Native American or American Indian (non-Hispanic or Latino)',
                'White or Caucasian (Non-Hispanic or Latino)',
                'Other'
              ].map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    value === option 
                      ? 'border-uiuc-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="ethnicity"
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                    value === option ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {value === option && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'university':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">University *</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="University of Illinois at Urbana-Champaign"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'department':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Department *</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="Computer Science"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'title':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Academic Title *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Assistant Professor',
                'Associate Professor', 
                'Professor',
                'Research Professor',
                'Clinical Professor',
                'Lecturer',
                'Senior Lecturer',
                'Principal Investigator'
              ].map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    value === option 
                      ? 'border-uiuc-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="title"
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    value === option ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {value === option && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'bio':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Bio *</label>
            <textarea
              rows={4}
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 resize-none ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="Describe your research focus, background, and academic interests..."
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'researchAreas':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Research Areas * (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {RESEARCH_AREAS.map((area) => (
                <motion.label
                  key={area.id}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                    (value || []).includes(area.name)
                      ? 'border-uiuc-blue bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(value || []).includes(area.name)}
                    onChange={() => {
                      const currentValues = value || [];
                      const newValues = currentValues.includes(area.name)
                        ? currentValues.filter((v: string) => v !== area.name)
                        : [...currentValues, area.name];
                      handleInputChange(field, newValues);
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                    (value || []).includes(area.name) ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {(value || []).includes(area.name) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{area.name}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'requiredSkills':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Required Skills * (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {SKILLS.map((skill) => (
                <motion.label
                  key={skill}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                    (value || []).includes(skill)
                      ? 'border-uiuc-blue bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(value || []).includes(skill)}
                    onChange={() => {
                      const currentValues = value || [];
                      const newValues = currentValues.includes(skill)
                        ? currentValues.filter((v: string) => v !== skill)
                        : [...currentValues, skill];
                      handleInputChange(field, newValues);
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                    (value || []).includes(skill) ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {(value || []).includes(skill) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{skill}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      // case 'fundingHistory':
      //   return (
      //     <div className="space-y-2">
      //       <label className="block text-sm font-semibold text-gray-800">Funding History *</label>
      //       <textarea
      //         rows={4}
      //         value={value || ''}
      //         onChange={(e) => handleInputChange(field, e.target.value)}
      //         className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 resize-none ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
      //         placeholder="Describe your funding sources, grants, and research support..."
      //       />
      //       {error && <p className="text-red-500 text-xs">{error}</p>}
      //     </div>
      //   );

      case 'labSize':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Current Lab/Team Size *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sectionIndex)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="8"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'mentorshipStyle':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Mentorship Style *</label>
            <textarea
              rows={4}
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-lg focus:ring-2 focus:ring-uiuc-blue outline-none transition-all duration-300 resize-none ${error ? 'border-red-400' : 'border-gray-300 focus:border-uiuc-blue'}`}
              placeholder="Describe your approach to mentoring students..."
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'preferredStudentLevel':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Preferred Student Levels * (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-3">
              {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student', 'PhD Student'].map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    (value || []).includes(option)
                      ? 'border-uiuc-blue bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={() => {
                      const currentValues = value || [];
                      const newValues = currentValues.includes(option)
                        ? currentValues.filter((v: string) => v !== option)
                        : [...currentValues, option];
                      handleInputChange(field, newValues);
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                    (value || []).includes(option) ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {(value || []).includes(option) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      case 'lookingForStudents':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">Are you currently looking for students? *</label>
            <div className="space-y-2">
              {['Yes, I am actively seeking students', 'No, not at this time'].map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    value === option 
                      ? 'border-uiuc-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="lookingForStudents"
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    value === option ? 'border-uiuc-blue bg-uiuc-blue' : 'border-gray-400'
                  }`}>
                    {value === option && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-uiuc-blue text-white px-3 py-1 rounded-lg font-bold text-sm">
                LABYRINTH
              </div>
              <span className="text-gray-600 text-sm">Professor Registration</span>
            </div>
            
            <Link href="/" className="text-gray-600 hover:text-gray-800 flex items-center text-sm">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Progress */}
      <div className="fixed top-20 right-6 z-40">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
        >
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-uiuc-blue">{Math.round(progress)}%</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-uiuc-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-3 space-y-1">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  completedSections.includes(index)
                    ? 'bg-green-500'
                    : index === currentSection
                    ? 'bg-uiuc-blue'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-uiuc-blue mb-4">
            Welcome to LABYRINTH
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your profile to connect with talented students
          </p>
          <div className="mt-4 text-sm text-gray-500">
            💡 Tip: Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to move to the next section
          </div>
        </motion.div>

        {/* Form Sections */}
        <div className="space-y-16">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              ref={(el) => { sectionRefs.current[sectionIndex] = el; }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-500">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        completedSections.includes(sectionIndex) 
                          ? 'bg-green-500' 
                          : 'bg-uiuc-blue'
                      }`}>
                        {completedSections.includes(sectionIndex) ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <span>{sectionIndex + 1}</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <p className="text-gray-600 ml-11">{section.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {section.fields.filter(field => answers[field]).length} / {section.fields.length} completed
                    </div>
                  </div>
                </div>

                {/* Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className={field === 'ethnicity' || field === 'researchAreas' || field === 'requiredSkills' || field === 'bio' || /*field === 'fundingHistory' ||*/ field === 'mentorshipStyle' || field === 'title' || field === 'preferredStudentLevel' || field === 'lookingForStudents' ? 'md:col-span-2' : ''}
                    >
                      {renderField(field, sectionIndex)}
                    </motion.div>
                  ))}
                </div>

                {/* Section Navigation */}
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => validateSection(sectionIndex)}
                    className="bg-uiuc-blue text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-uiuc-blue-dark transition-all duration-300"
                  >
                    {completedSections.includes(sectionIndex) ? 'Section Complete ✓' : 'Validate Section'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Student Matches?</h3>
            <p className="text-gray-600 mb-8">
              Complete your profile to discover students whose interests align with your research
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={completedSections.length !== sections.length}
              className="bg-uiuc-orange text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-uiuc-orange-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Complete Profile & Find Students
            </motion.button>

            {completedSections.length !== sections.length && (
              <p className="text-gray-500 text-sm mt-4">
                Please complete all sections above to continue
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessorOnboarding;