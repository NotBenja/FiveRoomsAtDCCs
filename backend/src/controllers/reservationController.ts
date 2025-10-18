import { Request, Response } from 'express';
import Reservation from '../models/Reservation';

/**
 * Method to get all reservations
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getAllReservations: could not fetch reservations',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to get a specific reservation by its ID
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const getReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await Reservation.findOne({ id });

        if (!reservation) {
            res.status(404).json({ error: 'Error on getReservationById: Reservation not found' });
            return;
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({
            error: 'Error on getReservationById: could not fetch reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to create a reservation
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, roomID, userID, time, status } = req.body;

        // required fields check
        if (!id || !roomID || !userID || !time) {
            res.status(400).json({ error: 'Error on createReservation: Some required fields are not present.' });
            return;
            }

        // check for existing reservation with the same id
        const existingReservation = await Reservation.findOne({ id });
        if (existingReservation) {
            res.status(409).json({ error: 'Error on createReservation: there is already a reservation with the provided id' });
            return;
        }

        // create the new reservation
        const newReservation = new Reservation({
            id,
            roomID,
            userID,
            time,
            status: status || 'pending'
        });
        await newReservation.save(); // save to database

        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({
            error: 'Error on createReservation: could not create reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to update a reservation
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const updateReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const reservation = await Reservation.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!reservation) {
            res.status(404).json({ error: 'Error on updateReservation: reservation not found' });
            return;
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({
            error: 'Error on updateReservation: could not update reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Method to delete a reservation
 * @param req request in HTTP message
 * @param res response in HTTP message
*/
export const deleteReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const reservation = await Reservation.findOneAndDelete({ id });

        if (!reservation) {
            res.status(404).json({ error: 'Error on deleteReservation: reservation not found' });
            return;
        }

        res.status(200).json({ message: 'Reservation deleted succesfully', reservation });
    } catch (error) {
        res.status(500).json({
            error: 'Error on deleteReservation: could not delete reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};