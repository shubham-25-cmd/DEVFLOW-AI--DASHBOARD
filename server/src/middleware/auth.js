import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
