const authService = require('./auth-service');

// JWT auth process
async function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = authService.verifyJwt(bearerToken);
    const user = await authService.getUserByUserName(req.app.get('db'), payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = {
  requireAuth
};
