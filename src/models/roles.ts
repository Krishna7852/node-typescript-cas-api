export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user'
}

export interface Permission {
    action: string;
    subject: string;
}

export const RolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        { action: 'manage', subject: 'all' }
    ],
    [UserRole.MANAGER]: [
        { action: 'read', subject: 'users' },
        { action: 'create', subject: 'users' },
        { action: 'update', subject: 'users' },
        { action: 'delete', subject: 'users' }
    ],
    [UserRole.USER]: [
        { action: 'read', subject: 'profile' },
        { action: 'update', subject: 'profile' }
    ]
}
