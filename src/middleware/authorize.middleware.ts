import { Request, Response, NextFunction } from 'express';
import { UserRole, RolePermissions, Permission } from '../models/roles';

export const authorize = (requiredPermissions: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = req.body?.role as UserRole;

            if (!userRole) {
                return res.status(403).json({ message: 'Forbidden: Role not found' });
            }

            const userPermissions = RolePermissions[userRole];

            // Check if user has admin access
            if (userPermissions.some(p => p.action === 'manage' && p.subject === 'all')) {
                return next();
            }

            // Check if user has all required permissions
            const hasRequiredPermissions = requiredPermissions.every(required => 
                userPermissions.some(userPerm => 
                    userPerm.action === required.action && 
                    userPerm.subject === required.subject
                )
            );

            if (!hasRequiredPermissions) {
                return res.status(403).json({ 
                    message: 'Forbidden: Insufficient permissions' 
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Helper functions for common authorization checks
export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'Forbidden: Insufficient role permissions' 
            });
        }

        next();
    };
};
