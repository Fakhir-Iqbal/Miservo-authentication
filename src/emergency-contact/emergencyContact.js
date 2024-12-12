import EmergencyContact from '../models/emergency_contact.js';
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";

export default async function saveEmergencyContact(req, res) {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const { _id } = decodeToken(token);

        const { primary, secondary, other_1, other_2 } = req.body;

        const emergencyContact = new EmergencyContact({
            primary,
            secondary,
            other_1,
            other_2,
            added: _id
        });

        const savedEmergencyContact = await emergencyContact.save();

        if (!savedEmergencyContact) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'Failed to save data'));
        }

        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Emergency contact successfully saved', savedEmergencyContact));

    } catch (error) {
        if (error.code === 11000) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'email already exist'));
        }
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path.replaceAll('`', ''),
                message: err.message.replaceAll('`', ''),
            }));
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, errors));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, error.message.replaceAll('`', ''), null));

    }
};
