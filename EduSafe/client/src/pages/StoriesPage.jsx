import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaShare, FaPlus, FaTimes } from 'react-icons/fa';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    image: ''
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stories');
      setStories(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stories');
      setLoading(false);
      console.error('Stories fetch error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];
      
      const storyData = {
        ...formData,
        tags: tagsArray
      };
      
      await axios.post('/api/stories', storyData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        content: '',
        tags: '',
        image: ''
      });
      setShowModal(false);
      
      // Refresh stories
      fetchStories();
    } catch (err) {
      console.error('Error creating story:', err);
      alert('Failed to create story. Please try again.');
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`/api/stories/${id}/like`);
      
      // Update story likes in the UI
      setStories(stories.map(story => 
        story._id === id 
          ? { ...story, likes: story.likes + 1 } 
          : story
      ));
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Success Stories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Share Your Story
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Story Image */}
            {story.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Story Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{story.title}</h2>
              <p className="text-gray-600 mb-4">
                {story.content.length > 150 
                  ? `${story.content.substring(0, 150)}...` 
                  : story.content}
              </p>
              
              {/* Tags */}
              {story.tags && story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Author and Date */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>By {story.authorName}</span>
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleLike(story._id)}
                  className="flex items-center text-gray-600 hover:text-red-500"
                >
                  <FaHeart className="mr-1" /> {story.likes}
                </button>
                <button className="flex items-center text-gray-600 hover:text-blue-500">
                  <FaShare className="mr-1" /> Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Share Your Story</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. inspiration, success, journey"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image URL (optional)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;