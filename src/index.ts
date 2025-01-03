import jwt from 'jsonwebtoken';
import { Token } from './models/token.model';
import { IUser } from './models/user.model';
import config from './config/config';
import { Types } from 'mongoose';

export class TokenService {
  static async generateTokens(user: IUser) {
    try {
      const accessToken = jwt.sign(
        { userId: user._id },
        config.jwtAccessSecret,
        { expiresIn: config.accessTokenExpiresIn }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        config.jwtRefreshSecret,
        { expiresIn: config.refreshTokenExpiresIn }
      );

      // Calculate refresh token expiry
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      // Save refresh token to database
      await Token.create({
        userId: user._id,
        token: refreshToken,
        expiresAt,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Error generating tokens: ' + (error as Error).message);
    }
  }

  static async verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
      
      // Check if token exists in database
      const tokenDoc = await Token.findOne({
        userId: new Types.ObjectId(decoded.userId),
        token: token,
      });

      if (!tokenDoc) {
        throw new Error('Refresh token not found');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async removeRefreshToken(userId: string, token: string) {
    await Token.deleteOne({ userId: new Types.ObjectId(userId), token });
  }

  static async removeAllRefreshTokens(userId: string) {
    await Token.deleteMany({ userId: new Types.ObjectId(userId) });
  }
}

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { userRouter } from './routes/user.routes';
import { fileRouter } from './routes/file.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRouter); 
app.use('/api/users', userRouter); 
app.use('/api/files', fileRouter);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });
