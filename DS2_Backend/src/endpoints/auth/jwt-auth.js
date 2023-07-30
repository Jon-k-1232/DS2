const authService = require('./auth-service');

// JWT Authentication Middleware
const requireAuth = async (req, res, next) => {
  // const tokens = req.cookies.session;

  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = authService.verifyJwt(bearerToken);
    const [user] = await authService.getUserByUserName(req.app.get('db'), payload.sub);

    // Check if user exists and is active
    if (!user || !user.is_login_active) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(401).json({ error: 'Unauthorized request' });
  }
};

module.exports = {
  requireAuth
};
