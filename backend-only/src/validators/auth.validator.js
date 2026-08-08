import { body } from 'express-validator';

export const registerValidator = [
  body('fullName').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').isLength({ min: 10 }).withMessage('Valid phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];
