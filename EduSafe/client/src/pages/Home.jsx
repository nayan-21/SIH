import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">EduSafe</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for safe and secure educational experiences
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
