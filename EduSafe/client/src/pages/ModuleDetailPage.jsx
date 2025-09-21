import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ModuleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchModuleDetails();
  }, [id]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch module details
      const moduleResponse = await axios.get(`http://localhost:5000/api/modules/${id}`);
      if (moduleResponse.data.success) {
        setModule(moduleResponse.data.data.module);
      }

      // Fetch quiz details
      try {
        const quizResponse = await axios.get(`http://localhost:5000/api/modules/${id}/quiz`);
        if (quizResponse.data.success) {
          setQuiz(quizResponse.data.data.quiz);
        }
      } catch (quizError) {
        // Quiz might not exist, that's okay
        console.log('No quiz found for this module');
      }

    } catch (err) {
      console.error('Error fetching module details:', err);
      setError('Failed to load module details. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVideoThumbnail = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const videoLessons = module?.lessons?.filter(lesson => lesson.type === 'video') || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module details...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Module not found'}
          </h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                EduSafe
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contents</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                    activeSection === 'overview'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📋 Overview
                </button>
                <button
                  onClick={() => setActiveSection('videos')}
                  className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                    activeSection === 'videos'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🎥 Videos ({videoLessons.length})
                </button>
                <button
                  onClick={() => setActiveSection('quiz')}
                  className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                    activeSection === 'quiz'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🧠 Quiz {quiz ? '' : '(Not Available)'}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeSection === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Module Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                          {getDifficultyIcon(module.difficulty)} {module.difficulty}
                        </span>
                        <span>⏱️ {module.duration}</span>
                        <span>📖 {module.lessonCount} lessons</span>
                      </div>
                    </div>
                  </div>

                  {/* Module Thumbnail */}
                  {module.thumbnail && (
                    <div className="mb-6">
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">About this module</h2>
                    <p className="text-gray-700 leading-relaxed">{module.description}</p>
                  </div>

                  {/* Module Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">⏱️</div>
                        <div>
                          <div className="text-sm text-gray-600">Duration</div>
                          <div className="font-semibold text-gray-900">{module.estimatedHours}h</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📚</div>
                        <div>
                          <div className="text-sm text-gray-600">Lessons</div>
                          <div className="font-semibold text-gray-900">{module.lessonCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📂</div>
                        <div>
                          <div className="text-sm text-gray-600">Category</div>
                          <div className="font-semibold text-gray-900">{module.category}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructor */}
                  {module.instructor && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructor</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-semibold text-lg">
                            {module.instructor.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{module.instructor.username}</div>
                          <div className="text-sm text-gray-600">{module.instructor.email}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'videos' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lessons</h2>
                
                {videoLessons.length > 0 ? (
                  <div className="space-y-6">
                    {/* Video Player */}
                    {selectedVideo && (
                      <div className="mb-8">
                        <div className="bg-black rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.videoUrl)}`}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-96"
                          ></iframe>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                          <p className="text-gray-600 mt-2">{selectedVideo.content}</p>
                        </div>
                      </div>
                    )}

                    {/* Video List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videoLessons.map((lesson, index) => (
                        <div
                          key={lesson._id}
                          onClick={() => setSelectedVideo(lesson)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            selectedVideo?._id === lesson._id
                              ? 'border-blue-500 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={getVideoThumbnail(lesson.videoUrl) || '/api/placeholder/300/200'}
                              alt={lesson.title}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <div className="bg-white bg-opacity-90 rounded-full p-3">
                                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                              {lesson.estimatedTime || 5}min
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{lesson.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No video lessons available</h3>
                    <p className="text-gray-500">This module doesn't contain any video content yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'quiz' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h2>
                
                {quiz ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-gray-700 mb-4">{quiz.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{quiz.questionCount}</div>
                          <div className="text-sm text-gray-600">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{quiz.timeLimit}</div>
                          <div className="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{quiz.passingScore}%</div>
                          <div className="text-sm text-gray-600">Passing Score</div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                      Start Quiz
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🧠</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz available</h3>
                    <p className="text-gray-500">This module doesn't have a quiz yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
