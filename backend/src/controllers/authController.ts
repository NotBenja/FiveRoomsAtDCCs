import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'jws_secret_key';  // jwt secret key, should be in env variables
const JWT_EXPIRES_IN = '7d';    // token expiration time, should be in env variables

/**
 * User Registration method
 * @param req request in HTTP message
 * @param res response in HTTP message
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, first_name, last_name, email, password } = req.body;

        // required fields check
        if (!id || !first_name || !last_name || !email || !password) {
            res.status(400).json({ error: 'Validation error on register: All parameters are required' });
            return;
        }

        // verification of existing user by id or email
        const existingUser = await User.findOne({ $or: [{ id }, { email }] });
        if (existingUser) {
            res.status(409).json({ error: 'Validation error on register: There is already a user with that id or email' });
            return;
        }

        // creation of new user (the password is hashed in src/models/User.ts)
        const newUser = new User({ id, first_name, last_name, email, password });
        await newUser.save();

        // JWT management
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // sets a cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // se supone que 7 dias (todo: checkear si lo calcule bien xd)
        });

        // sends a response with the token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email
            },
            token
        });
      } catch (error) {
            res.status(500).json({
                  error: 'Error on register: could not register user',
                  details: error instanceof Error ? error.message : 'Unknown error'
            });
      }
};

/**
 * User Login method
 * @param req request in HTTP message
 * @param res response in HTTP message
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // required fields check
        if (!email || !password) {
             res.status(400).json({ error: 'Validation error on login: Email and password are required' });
            return;
        }

        // checks if a user with that email exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Error on login: Either the email and/or password is incorrect' });
            return;
        }

        // checkd if the password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Error on login: Either the email and/or password is incorrect' });
            return;
        }

        // JWT management
        const token = jwt.sign(
            { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
        );

        // Sets a cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // se supone que 7 dias (todo: checkear si lo calcule bien xd)
        });

        // Sends a response with the token
        res.status(200).json({
            message: 'Successfully logged in',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error on login: could not log in user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * User Login method
 * @param req request in HTTP message
 * @param res response in HTTP message
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('token');           // the cookie is cleared in order to log out the user
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({
            error: 'Error on logout',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * User method that provides information about the logged-in user
 * @param req request in HTTP message
 * @param res response in HTTP message
 */
export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;

        const user = await User.findOne({ id: userId });
        if (!user) {
            res.status(404).json({ error: 'Error on me: User not found' });
            return;
        }

        res.status(200).json({
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error on me: could not fetch user info',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};