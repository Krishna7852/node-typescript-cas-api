import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, authorizeRoles } from '../middleware/authorize.middleware';
import { UserRole } from '../models/roles';

const router = Router();

// Example of role-based route protection
router.get(
    '/users',
    authenticate,
    authorize([{ action: 'read', subject: 'users' }]),
    async (req, res) => {
        // Your user listing logic here
        res.json({ message: 'Users list' });
    }
);

// Example of direct role check
router.post(
    '/system-settings',
    authenticate,
    authorizeRoles(UserRole.ADMIN),
    async (req, res) => {
        // Your system settings logic here
        res.json({ message: 'System settings updated' });
    }
);

// Example of manager-level access
router.put(
    '/users/:userId',
    authenticate,
    authorize([{ action: 'update', subject: 'users' }]),
    async (req, res) => {
        // Your user update logic here
        res.json({ message: 'User updated' });
    }
);

export default router;
