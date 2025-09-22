import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch modules
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/modules');
      
      if (response.data.success) {
        console.log('Modules data:', response.data.data.modules);
        setModules(response.data.data.modules);
      } else {
        // If no success property but data exists
        console.log('Fallback modules data:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setModules(response.data);
        }
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Failed to load modules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '🟢';
      case 'intermediate':
        return '🟡';
      case 'advanced':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  // Force modules to display for testing
  useEffect(() => {
    if (modules.length === 0 && !loading) {
      // Add some dummy modules if none are loaded
      setModules([
        {
          _id: "dummy1",
          title: "Cyberbullying Awareness",
          description: "Learn about cyberbullying, its impact, and how to prevent it.",
          difficulty: "beginner",
          thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3"
        },
        {
          _id: "dummy2",
          title: "School Safety Fundamentals",
          description: "Essential knowledge about physical safety in school environments.",
          difficulty: "beginner",
          thumbnail: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3"
        },
        {
          _id: "dummy3",
          title: "Mental Health Awareness",
          description: "Understand the importance of mental health and recognize warning signs.",
          difficulty: "intermediate",
          thumbnail: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?ixlib=rb-4.0.3"
        }
      ]);
    }
  }, [modules, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                EduSafe
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-gray-700">Welcome, {user.username}</span>
              )}
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Modules
            </h1>
            <p className="text-gray-600">
              Explore our comprehensive collection of educational modules
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Modules Grid */}
          {modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module._id}
                  onClick={() => handleModuleClick(module._id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
                >
                  {/* Module Image/Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg relative overflow-hidden">
                    {module.thumbnail ? (
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-white text-6xl">📚</div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {getDifficultyIcon(module.difficulty)} {module.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Module Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {module.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    {/* Module Stats */}
                    <div className="space-y-3">
                      {/* Duration */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">⏱️</span>
                        <span>{module.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{module.estimatedHours}h</span>
                      </div>

                      {/* Category */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📂</span>
                        <span>{module.category}</span>
                      </div>

                      {/* Instructor */}
                      {module.instructor && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">👨‍🏫</span>
                          <span>{module.instructor.username}</span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                      </div>

                      {/* Lesson Count */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>📖 {module.lessonCount || 0} lessons</span>
                        <span className="text-blue-600 font-medium">View Details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No modules available
              </h3>
              <p className="text-gray-500">
                Check back later for new learning content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
