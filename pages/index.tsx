import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-uiuc-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-uiuc-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-gradient-to-r from-uiuc-blue to-uiuc-blue-light text-white px-6 py-3 rounded-2xl font-bold text-sm inline-block mb-6 shadow-lg"
            >
              <SparklesIcon className="w-4 h-4 inline mr-2" />
              UIUC RESEARCH PLATFORM
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-uiuc-blue via-uiuc-blue-light to-uiuc-orange mb-6 leading-tight"
          >
            LABYRINTH
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-700 text-xl leading-relaxed font-medium"
          >
            Navigate your path to the perfect research collaboration
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-gray-500 text-sm mt-2"
          >
            University of Illinois at Urbana-Champaign
          </motion.p>
        </motion.div>

        {/* Auth Buttons */}
        <div className="space-y-6">
          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          >
            <Link href="/auth/login" className="block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-uiuc-blue to-uiuc-blue-light rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-uiuc-blue to-uiuc-blue-light text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 group cursor-pointer transform group-hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-all duration-300">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Welcome Back
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Continue your research journey with existing account
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          >
            <Link href="/auth/signup" className="block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-uiuc-orange to-uiuc-orange-light rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-uiuc-orange to-uiuc-orange-light text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 group cursor-pointer transform group-hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-all duration-300">
                    <PlusIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Start Your Journey
                  </h2>
                  <p className="text-orange-100 text-lg leading-relaxed">
                    Create your profile and discover perfect research matches
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Advanced AI-Powered Matching</span>
          </div>
        </motion.div>
      </div>

      {/* Subtle Animation */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-20 right-20 w-4 h-4 bg-uiuc-orange/30 rounded-full"
      />
      
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-20 left-20 w-3 h-3 bg-uiuc-blue/30 rounded-full"
      />
    </div>
  );
}