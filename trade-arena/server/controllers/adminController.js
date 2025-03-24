const Admin = require('../models/Admin');
const User = require('../models/User');
const Ranking = require('../models/Ranking');
const jwt = require('jsonwebtoken');

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Private/Super Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ $or: [{ username }, { email }] });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      password,
      email,
      role: role || 'moderator'
    });

    res.status(201).json({
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error during admin registration' });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username & password
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check for admin
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = admin.getSignedJwtToken();

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { username, email, displayName, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (displayName) user.displayName = displayName;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// @desc    Adjust user ranking
// @route   PUT /api/admin/rankings/:userId
// @access  Private/Admin
exports.adjustRanking = async (req, res) => {
  try {
    const { userId } = req.params;
    const { performance, winRate, consistencyScore, rankTier } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find user's ranking
    let ranking = await Ranking.findOne({ user: userId });
    
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking not found for this user' });
    }
    
    // Update ranking fields
    if (performance !== undefined) ranking.performance = performance;
    if (winRate !== undefined) ranking.winRate = winRate;
    if (consistencyScore !== undefined) ranking.consistencyScore = consistencyScore;
    if (rankTier) ranking.rankTier = rankTier;
    
    await ranking.save();
    
    res.json({
      message: 'Ranking adjusted successfully',
      ranking
    });
  } catch (error) {
    console.error('Adjust ranking error:', error);
    res.status(500).json({ message: 'Server error while adjusting ranking' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get active users count
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Get users registered in the last 7 days
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: lastWeekDate }
    });
    
    // Get top ranked users
    const topRankedUsers = await Ranking.find()
      .sort({ performance: -1 })
      .limit(5)
      .populate('user', 'username displayName');
    
    res.json({
      totalUsers,
      activeUsers,
      newUsers,
      topRankedUsers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};
