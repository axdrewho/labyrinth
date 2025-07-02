import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check students
      const students = JSON.parse(localStorage.getItem('labyrinth_students') || '[]');
      const student = students.find((s: any) => (s.email || '').trim().toLowerCase() === email.trim().toLowerCase());
      
      if (student) {
        router.push(`/student/matches?id=${student.id}`);
        return;
      }

      // Check professors
      const professors = JSON.parse(localStorage.getItem('labyrinth_professors') || '[]');
      const professor = professors.find((p: any) => (p.email || '').trim().toLowerCase() === email.trim().toLowerCase());
      
      if (professor) {
        router.push(`/professor/dashboard?id=${professor.id}`);
        return;
      }

      // No user found
      setError('No account found with this email address. Please sign up first.');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your research account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border bg-white border-gray-300 rounded-xl focus:border-uiuc-blue focus:ring-2 focus:ring-uiuc-blue/20 outline-none transition-all duration-200 text-gray-900"
                placeholder="your.email@illinois.edu"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border bg-white border-gray-300 rounded-xl focus:border-uiuc-blue focus:ring-2 focus:ring-uiuc-blue/20 outline-none transition-all duration-200 text-gray-900"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uiuc-blue text-white py-3 px-4 rounded-xl font-semibold hover:bg-uiuc-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Instructions */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg"
          >
            <h3 className="font-medium text-blue-900 mb-2">Demo Instructions:</h3>
            <p className="text-blue-700 text-sm mb-2">
              To test the login, first create an account by clicking "Sign Up" below, then return here and use the same email address.
            </p>
            <p className="text-blue-600 text-xs">
              Any password will work for this demo.
            </p>
          </motion.div> */}

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-uiuc-blue hover:text-uiuc-blue-dark font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}