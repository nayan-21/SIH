const express = require('express');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');

const router = express.Router();

// @route   GET /api/modules
// @desc    Fetch all available modules
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isPublished: true,
      isActive: true
    };

    // Add difficulty filter
    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    // Add category filter
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Add search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const modules = await Module.find(filter)
      .populate('instructor', 'username email')
      .select('-lessons') // Exclude lessons for list view
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Module.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        modules,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalModules: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching modules'
    });
  }
});

// @route   GET /api/modules/:id
// @desc    Fetch a single module's details by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module ID format'
      });
    }

    const module = await Module.findOne({
      _id: id,
      isPublished: true,
      isActive: true
    })
    .populate('instructor', 'username email')
    .populate('prerequisites', 'title description difficulty');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Add virtual fields to response
    const moduleData = {
      ...module.toObject(),
      lessonCount: module.lessonCount,
      totalEstimatedTime: module.totalEstimatedTime
    };

    res.json({
      success: true,
      data: {
        module: moduleData
      }
    });

  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching module'
    });
  }
});

// @route   GET /api/modules/:id/quiz
// @desc    Fetch the quiz associated with a module
// @access  Public
router.get('/:id/quiz', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module ID format'
      });
    }

    // First check if module exists
    const module = await Module.findOne({
      _id: id,
      isPublished: true,
      isActive: true
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Find quiz associated with the module
    const quiz = await Quiz.findOne({
      module: id,
      isPublished: true,
      isActive: true
    })
    .populate('instructor', 'username email')
    .select('-questions.options.isCorrect'); // Hide correct answers for security

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this module'
      });
    }

    // Add virtual fields to response
    const quizData = {
      ...quiz.toObject(),
      questionCount: quiz.questionCount,
      totalPoints: quiz.totalPoints,
      averageQuestionTime: quiz.averageQuestionTime
    };

    res.json({
      success: true,
      data: {
        quiz: quizData
      }
    });

  } catch (error) {
    console.error('Error fetching module quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching module quiz'
    });
  }
});

// @route   GET /api/modules/:id/lessons
// @desc    Fetch lessons for a specific module
// @access  Public
router.get('/:id/lessons', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module ID format'
      });
    }

    const module = await Module.findOne({
      _id: id,
      isPublished: true,
      isActive: true
    })
    .select('lessons title');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Sort lessons by order
    const sortedLessons = module.lessons.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: {
        moduleTitle: module.title,
        lessons: sortedLessons
      }
    });

  } catch (error) {
    console.error('Error fetching module lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching module lessons'
    });
  }
});

module.exports = router;
