import jwt from 'jsonwebtoken';

export const AuthMiddleware = (req, res, next) => {
  // 1. Get the token from the 'Authorization' header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    // 2. Verify the token
    const secretKey = process.env.JWT_SECRET; // Ensure you have this secret in your environment variables
    const decoded = jwt.verify(token, secretKey);

    // 3. Attach user info to the request
    req.user = decoded; // Now `req.user` contains user information

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};
