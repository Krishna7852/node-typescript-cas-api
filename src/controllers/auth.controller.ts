import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Auth } from '../models/auth.model';
import { logger } from '../utils/logger';
import { TokenService } from '../services/token.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await Auth.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await Auth.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate tokens using TokenService
    const { accessToken, refreshToken } = await TokenService.generateTokens(user);

    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = await Auth.findOne({
      $or: [
        { email },
        { username }
      ]
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens using TokenService
    const { accessToken, refreshToken } = await TokenService.generateTokens(user);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  res.json({ message: 'Token is valid', user: req.user });
};

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const user = await Auth.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User details retrieved successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
