import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { UserRole } from '../models/roles';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(...Object.values(UserRole))
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email(),
        firstName: Joi.string(),
        lastName: Joi.string()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

export const validateRole = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        role: Joi.string().valid(...Object.values(UserRole)).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};
