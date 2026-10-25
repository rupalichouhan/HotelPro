const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026';

const fetchUser = (req, res, next) => {
  // Get token from auth-token header or Authorization: Bearer <token>
  let token = req.header('auth-token');
  if (!token && req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No authentication token provided',
    });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Invalid or expired token',
    });
  }
};

module.exports = fetchUser;
