import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/roles';
import { User } from '../models/user.model';
import { Auth } from '../models/auth.model';


export class UserController {
    // Get all users (Admin/Manager only)
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID
    static async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findById(req.params.userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Create new user (Admin/Manager only)
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, firstName, lastName, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({
                email,
                password,
                firstName,
                lastName,
                role: role || UserRole.USER
            });

            await user.save();
            
            const userResponse = user.toObject();
            if (userResponse.password) {
                delete userResponse.password;
            }
            
            res.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    }

    // Update user
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const updates = req.body;
            
            // Don't allow role updates through this endpoint
            delete updates.role;
            delete updates.password;

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Update user role (Admin only)
    static async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            if (!Object.values(UserRole).includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { role } },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Delete user (Admin only)
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // Get current user profile
    static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }            
            const user = await Auth.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    // Update current user's profile
    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const updates = req.body;
            
            // Don't allow role or password updates through this endpoint
            delete updates.role;
            delete updates.password;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}
