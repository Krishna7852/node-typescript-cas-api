import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, authorizeRoles } from '../middleware/authorize.middleware';
import { validateUser, validateUserUpdate, validateRole } from '../middleware/validation.middleware';
import { UserRole } from '../models/roles';

const router = Router();

// Public routes (no authentication required)
router.post('/register', validateUser, UserController.createUser);

// Protected routes - require authentication
router.use(authenticate);

// Current user profile routes - any authenticated user can access their own profile
router.get('/profile', UserController.getCurrentUser);
router.put('/profile', validateUserUpdate, UserController.updateProfile);

// User management routes - requires specific permissions
router.get(
    '/',
    authorize([{ action: 'read', subject: 'users' }]),
    UserController.getAllUsers
);

router.get(
    '/:userId',
    authorize([{ action: 'read', subject: 'users' }]),
    UserController.getUserById
);

router.post(
    '/',
    authorize([{ action: 'create', subject: 'users' }]),
    validateUser,
    UserController.createUser
);

router.put(
    '/:userId',
    authorize([{ action: 'update', subject: 'users' }]),
    validateUserUpdate,
    UserController.updateUser
);

// Admin-only routes
router.put(
    '/:userId/role',
    authorizeRoles(UserRole.ADMIN),
    validateRole,
    UserController.updateUserRole
);

router.delete(
    '/:userId',
    authorizeRoles(UserRole.ADMIN),
    UserController.deleteUser
);

export const userRouter = router;
export default router;
