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

const requireAdmin = async (req, res, next) => {
   // Assuming `getUserByUserName` returns roles as part of user object
   const authToken = req.get('Authorization').slice(7);
   const payload = authService.verifyJwt(authToken);
   const [user] = await authService.getUserRoleByUserName(req.app.get('db'), payload.sub);

   const lowerCaseUserAuth = user.access_level.toLowerCase();

   if (user && lowerCaseUserAuth === 'admin') {
      next();
   } else {
      return res.status(403).json({ error: 'Unauthorized' });
   }
};

const requireManager = async (req, res, next) => {
   // Assuming `getUserByUserName` returns roles as part of user object
   const authToken = req.get('Authorization').slice(7);
   const payload = authService.verifyJwt(authToken);
   const [user] = await authService.getUserRoleByUserName(req.app.get('db'), payload.sub);

   const lowerCaseUserAuth = user.access_level.toLowerCase();

   if (user && lowerCaseUserAuth === 'manager') {
      next();
   } else {
      return res.status(403).json({ error: 'Unauthorized' });
   }
};

const requireManagerOrAdmin = async (req, res, next) => {
   const authToken = req.get('Authorization').slice(7);
   const payload = authService.verifyJwt(authToken);
   const [user] = await authService.getUserRoleByUserName(req.app.get('db'), payload.sub);

   const lowerCaseUserAuth = user.access_level.toLowerCase();

   if (user && (lowerCaseUserAuth === 'manager' || lowerCaseUserAuth === 'admin')) {
      next();
   } else {
      return res.status(403).json({ error: 'Unauthorized' });
   }
};

module.exports = { requireAuth, requireAdmin, requireManager, requireManagerOrAdmin };
