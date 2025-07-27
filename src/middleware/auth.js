import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return next(new AppError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError('User not found', 404));

    req.user = user; // Attach user info to request object
    next();
  } catch (err) {
    next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

// auth.js
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log('User role at restrictTo:', req.user?.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// middlewares/auth.js
export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};



