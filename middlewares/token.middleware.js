const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = async (req, res, next) => {
  // Get auth header value
  const authHeader = req.headers['authorization'];

  // Extract token if auth header exists and starts with Bearer
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  try {
    const decodedUser = jwt.verify(token, config.JWT_ACCESS_SECRET);

    req.userId = decodedUser.id;

  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid Token" });
  }

  return next();
};

module.exports = verifyToken;
