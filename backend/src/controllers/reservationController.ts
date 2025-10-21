import { Request, Response } from 'express';
import Reservation from '../models/Reservation';

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

export const getReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

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

export const createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roomID, userID, time, status } = req.body;


        // Validación de campos requeridos
        if (!roomID || !userID || !time) {
            res.status(400).json({
                error: 'Error on createReservation: Some required fields are not present (roomID, userID, time).',
                received: { roomID, userID, time, status }
            });
            return;
        }

        const newReservation = new Reservation({
            roomID,
            userID,
            time,
            status: status || 'pendiente'
        });

        await newReservation.save();

        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error on createReservation:', error);
        res.status(500).json({
            error: 'Error on createReservation: could not create reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const reservation = await Reservation.findByIdAndUpdate(
            id,
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

export const deleteReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            res.status(404).json({ error: 'Error on deleteReservation: reservation not found' });
            return;
        }

        res.status(200).json({ message: 'Reservation deleted successfully', reservation });
    } catch (error) {
        res.status(500).json({
            error: 'Error on deleteReservation: could not delete reservation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};