const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function(req, res, next) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    
    // Get admin from database
    const admin = await Admin.findById(req.user.id);
    
    // Check if admin exists and is a super admin
    if (!admin || admin.role !== 'super') {
      return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Super admin auth error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};
