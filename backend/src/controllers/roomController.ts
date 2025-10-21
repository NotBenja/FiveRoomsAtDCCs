import { Request, Response } from 'express';
import Room from '../models/Room';

/**
 * Method to get all rooms
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getAllRooms: could not fetch rooms',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to get a specific room by its DI
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const room = await Room.findOne({ id });

        if (!room) {
            res.status(404).json({ error: 'Error on getRoomById: Room not found' });
            return;
        }

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getRoomById: could not fetch room',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to create a new room
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, room_name, features } = req.body;

        // required fields check
        if (!id || !room_name || !features) {
            res.status(400).json({ error: 'Validation error on createRoom: Some required fields are not present' });
            return;
        }

        // check for existing room with the same id
        const existingRoom = await Room.findOne({ id });
        if (existingRoom) {
            res.status(409).json({ error: 'Error on createRoom: There is already a room with the provided id' });
            return;
        }

        const newRoom = new Room({ id, room_name, features });
        await newRoom.save();

        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({
            error: 'Error on createRoom: could not create room',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to update a room
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const room = await Room.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!room) {
            res.status(404).json({ error: 'Error on updateRoom: room not found' });
            return;
        }

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({
            error: 'Error on updateRoom: could not update room',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to delete a room
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const room = await Room.findOneAndDelete({ id });

        if (!room) {
            res.status(404).json({ error: 'Error on deleteRoom: room not found' });
            return;
        }

        res.status(200).json({ message: 'Room deleted succesfully', room });
    } catch (error) {
        res.status(500).json({
            error: 'Error on deleteRoom: could not delete room',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};