import { Request, Response } from 'express';
import User from '../models/User';

/**
 * Method to get all users
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getAllUsers: could not fetch users',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to get a specific user by its ID
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOne({ id });

        if (!user) {
            res.status(404).json({ error: 'Error on getUserById: Some required fields are not present' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getUserById: could not fetch user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to create a new user
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, first_name, last_name, email, password } = req.body;

        // required fields check
        if (!id || !first_name || !last_name || !email || !password) {
            res.status(400).json({ error: 'Error on createUser: Some required fields are not present' });
            return;
        }

        // check for existing user with the same id
        const existingUser = await User.findOne({ $or: [{ id }, { email }] });
        if (existingUser) {
            res.status(409).json({ error: 'Error on createUser: there is already a reservation with the provided id' });
            return;
        }

        const newUser = new User({ id, first_name, last_name, email, password });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            error: 'Error on createUser: could not create user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to update a user
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const user = await User.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ error: 'Error on updateUser: user not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Error on updateUser: could not update user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to delete a user
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOneAndDelete({ id });

        if (!user) {
            res.status(404).json({ error: 'Error on deleteUser: user not found' });
            return;
        }

        res.status(200).json({ message: 'User deleted succesfully', user });
    } catch (error) {
        res.status(500).json({
            error: 'Error on deleteUser: could not delete user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};