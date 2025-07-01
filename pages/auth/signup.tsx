import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Signup() {
  const router = useRouter();

  const handleRoleSelection = (role: 'student' | 'professor') => {
    // Store the selected role in localStorage for the onboarding process
    localStorage.setItem('signupRole', role);
    
    if (role === 'student') {
      router.push('/student/onboarding');
    } else {
      router.push('/professor/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-gradient-to-r from-uiuc-blue to-uiuc-blue-light text-white px-3 py-1 rounded-lg font-bold text-sm inline-block mb-4">
            <SparklesIcon className="w-4 h-4 inline mr-1" />
            LABYRINTH
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your role to get started with the right experience
          </p>
        </motion.div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => handleRoleSelection('student')}
            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-uiuc-blue/30 group cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-8 mx-auto group-hover:bg-uiuc-blue group-hover:scale-110 transition-all duration-300">
              <AcademicCapIcon className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              I'm a Student
            </h2>
            <p className="text-gray-600 text-center leading-relaxed mb-6">
              Find professors whose research aligns with your interests and career goals. Get matched based on your skills, GPA, and academic focus.
            </p>
            <div className="bg-uiuc-blue text-white py-3 px-6 rounded-xl font-semibold text-center group-hover:bg-uiuc-blue-dark transition-colors duration-300">
              Create Student Account
            </div>
          </motion.div>

          {/* Professor Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => handleRoleSelection('professor')}
            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-uiuc-orange/30 group cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-8 mx-auto group-hover:bg-uiuc-orange group-hover:scale-110 transition-all duration-300">
              <UserGroupIcon className="w-10 h-10 text-uiuc-orange group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              I'm a Professor
            </h2>
            <p className="text-gray-600 text-center leading-relaxed mb-6">
              Connect with motivated students who match your research areas and requirements. Find the perfect additions to your research team.
            </p>
            <div className="bg-uiuc-orange text-white py-3 px-6 rounded-xl font-semibold text-center group-hover:bg-uiuc-orange-dark transition-colors duration-300">
              Create Professor Account
            </div>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Profile</h4>
                <p className="text-gray-600 text-sm">
                  Complete our guided questionnaire to build your research profile
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4 mx-auto">
                  <span className="text-yellow-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Matched</h4>
                <p className="text-gray-600 text-sm">
                  Our algorithm finds compatible researchers based on your interests
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
                <p className="text-gray-600 text-sm">
                  Start meaningful research collaborations with your matches
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-uiuc-blue hover:text-uiuc-blue-dark font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}