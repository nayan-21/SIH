import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/leaderboard?limit=20');
        setLeaderboard(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        setLoading(false);
        console.error('Leaderboard fetch error:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to render rank badges
  const renderRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-amber-700 text-xl" />;
      default:
        return <span className="font-bold text-gray-700">{rank}</span>;
    }
  };

  // Function to determine badge based on points
  const getUserBadge = (points) => {
    if (points >= 1000) return { name: 'Expert', color: 'bg-purple-600' };
    if (points >= 500) return { name: 'Advanced', color: 'bg-blue-600' };
    if (points >= 200) return { name: 'Intermediate', color: 'bg-green-600' };
    return { name: 'Beginner', color: 'bg-gray-600' };
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
      <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center">
          <div className="w-16 text-center font-bold">Rank</div>
          <div className="flex-1 font-bold">User</div>
          <div className="w-24 text-center font-bold">Points</div>
          <div className="w-32 text-center font-bold">Badge</div>
        </div>
        
        {/* Leaderboard List */}
        <div className="divide-y divide-gray-200">
          {leaderboard.map((user) => {
            const badge = getUserBadge(user.points);
            
            return (
              <div 
                key={user._id} 
                className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors"
              >
                {/* Rank */}
                <div className="w-16 text-center">
                  {renderRankBadge(user.rank)}
                </div>
                
                {/* User */}
                <div className="flex-1 flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold mr-3">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                
                {/* Points */}
                <div className="w-24 text-center font-semibold">
                  {user.points}
                </div>
                
                {/* Badge */}
                <div className="w-32 text-center">
                  <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full`}>
                    {badge.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;