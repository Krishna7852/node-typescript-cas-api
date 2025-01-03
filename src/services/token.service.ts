import jwt from 'jsonwebtoken';
import { Token } from '../models/token.model';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';
import config from '../config/config';

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
      throw new Error('Error generating tokens');
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
