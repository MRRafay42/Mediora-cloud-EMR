// src/lib/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const authUtils = {
  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });
  },

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Get token from request headers
  // Get token from request headers (case-insensitive)
getTokenFromHeaders(headers) {
  if (!headers) return null;

  let authHeader = headers.get('authorization');
  if (!authHeader) {
    // Some environments capitalize it
    authHeader = headers.get('Authorization');
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
},


  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8;
  },
};

// Middleware to verify authentication
export async function verifyAuth(request) {
  try {
    const token = authUtils.getTokenFromHeaders(request.headers);
    
    if (!token) {
      return {
        error: 'No authentication token provided',
        status: 401,
      };
    }

    const decoded = authUtils.verifyToken(token);
    
    if (!decoded) {
      return {
        error: 'Invalid or expired token',
        status: 401,
      };
    }

    return {
      user: decoded,
      status: 200,
    };
  } catch (error) {
    return {
      error: 'Authentication failed',
      status: 401,
    };
  }
}