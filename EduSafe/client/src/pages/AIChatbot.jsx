import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm EduSafe AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Predefined Q&A pairs with keywords for matching
  const qaPairs = [
    {
      keywords: ['report', 'issue', 'problem', 'bug', 'report issue', 'report problem'],
      question: 'How do I report an issue?',
      answer: 'To report an issue, go to the "Report Issue" page from the main menu. Fill out the form with details about the problem you encountered, and our team will address it as soon as possible.'
    },
    {
      keywords: ['points', 'earn', 'score', 'leaderboard', 'ranking', 'earn points'],
      question: 'How do I earn points?',
      answer: 'You can earn points by completing modules, participating in quizzes, reporting valid issues, and contributing to the community. Points help you climb the leaderboard and unlock achievements!'
    },
    {
      keywords: ['password', 'forgot', 'reset', 'change password', 'forgot password'],
      question: 'I forgot my password. What should I do?',
      answer: 'If you forgot your password, click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you instructions to reset your password.'
    },
    {
      keywords: ['account', 'profile', 'update', 'edit profile', 'account settings'],
      question: 'How do I update my profile information?',
      answer: 'To update your profile, go to your account settings by clicking on your profile picture in the top-right corner. From there, you can edit your personal information, change your profile picture, and update your preferences.'
    },
    {
      keywords: ['module', 'course', 'lesson', 'complete', 'finish module'],
      question: 'How do I complete a module?',
      answer: 'To complete a module, navigate to the module page and go through all the content. At the end of each module, there will be a quiz or assessment. You need to pass this assessment to mark the module as complete.'
    },
    {
      keywords: ['certificate', 'certification', 'get certificate'],
      question: 'How do I get a certificate?',
      answer: 'Certificates are awarded upon completion of specific learning paths or courses. Once you complete all required modules in a course, you can download your certificate from your achievements page.'
    },
    {
      keywords: ['contact', 'support', 'help', 'contact support', 'customer service'],
      question: 'How do I contact support?',
      answer: 'You can contact our support team by sending an email to support@edusafe.com or by using the "Contact Us" form in the Help section. Our team is available Monday to Friday, 9 AM to 5 PM.'
    },
    {
      keywords: ['story', 'share', 'success', 'share story', 'success story'],
      question: 'How can I share my success story?',
      answer: 'You can share your success story by visiting the Stories page and clicking on the "Share Your Story" button. Fill out the form with your experience, and it will be published after review.'
    }
  ];

  // Quick questions for users to select
  const quickQuestions = [
    'How do I report an issue?',
    'How do I earn points?',
    'I forgot my password. What should I do?',
    'How do I contact support?'
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Find a response based on keywords
    const botResponse = findBotResponse(inputMessage);
    
    // Add bot response with a slight delay to simulate thinking
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 600);

    setInputMessage('');
  };

  // Handle clicking a quick question
  const handleQuickQuestion = (question) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Find a response based on the question
    const botResponse = findBotResponse(question);
    
    // Add bot response with a slight delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 600);
  };

  // Find a response based on keywords in the user's message
  const findBotResponse = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check if any keywords match
    for (const pair of qaPairs) {
      for (const keyword of pair.keywords) {
        if (lowercaseMessage.includes(keyword.toLowerCase())) {
          return pair.answer;
        }
      }
      
      // Also check if the message matches a predefined question
      if (lowercaseMessage === pair.question.toLowerCase()) {
        return pair.answer;
      }
    }
    
    // Default response if no match is found
    return "I'm not sure I understand. Could you rephrase your question or select one of the quick questions below?";
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <div className="flex items-center">
          <FaRobot className="text-2xl mr-3" />
          <div>
            <h1 className="font-bold text-lg">EduSafe AI Assistant</h1>
            <p className="text-xs text-blue-200">Online</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              <div className="flex items-center mb-1">
                {message.sender === 'bot' && <FaRobot className="mr-2 text-blue-600" />}
                {message.sender === 'user' && <FaUser className="mr-2 text-blue-300" />}
                <span className="font-semibold">
                  {message.sender === 'bot' ? 'EduSafe AI' : 'You'}
                </span>
              </div>
              <p>{message.text}</p>
              <div className="text-xs text-right mt-1 opacity-70">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Questions */}
      <div className="bg-gray-50 p-3 overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm whitespace-nowrap hover:bg-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;