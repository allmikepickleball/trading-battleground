const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Check if user is authenticated and is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};
