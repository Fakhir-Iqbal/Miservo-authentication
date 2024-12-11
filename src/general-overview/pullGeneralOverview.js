import mongoose from "mongoose";
import GeneralOverview from '../models/general_overview.js'; // Adjust the path as necessary
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";


export default async function pullGeneralOverview(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(createRes(StatusCodes.UNAUTHORIZED, 'Token is required'));
    }

    const { _id }  = decodeToken(token);

    try {
        const { skip = 0, limit = 10 } = req.query;

        const result = await GeneralOverview.aggregate([
            {
                $match: { addedBy: new mongoose.Types.ObjectId(_id) }
            },
            {
                $skip: parseInt(skip)
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        result.forEach(v => {
            delete v.added
            delete v.__v
            return v
        })

        return res
            .status(StatusCodes.OK)
            .json(createRes(StatusCodes.OK, 'Data fetched successfully', result));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, error.message.replaceAll('`', '')));
    }
}