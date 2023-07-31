const jwt = require('jsonwebtoken');
const authService = require('./auth-service');

// JWT Authentication Middleware
const requireAuth = async (req, res, next) => {
  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    // Check JWT token, and check if modified or expired
    const payload = authService.verifyJwt(bearerToken);

    const [user] = await authService.getUserByUserName(req.app.get('db'), payload.sub);

    // Check if user exists and is active
    if (!user || !user.is_login_active) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    next();
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Expired token' });
    } else {
      res.status(401).json({ error: 'Unauthorized request' });
    }
  }
};

module.exports = {
  requireAuth
};
