import { Request, Response, NextFunction } from 'express';
import { Auth } from '../models/auth.model';
import { TokenService } from '../services/token.service';
import { UserRole } from '../models/roles';
import { IUser } from '../models/user.interface';

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = await TokenService.verifyAccessToken(token);
      const user = await Auth.findById(decoded.userId) as IUser;
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role as UserRole
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    next(error);
  }
};
