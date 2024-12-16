import { GeneralOverview } from '../models/index.js';
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";

export const saveGeneralOverview = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { _id } = decodeToken(token);

        const generalOverviewData = { ...req.body, addedBy: _id };

        const savedGeneralOverview = await GeneralOverview.create(generalOverviewData);

        if (!savedGeneralOverview) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'Failed to save data'));
        }

        return res
            .status(StatusCodes.OK)
            .json(createRes(StatusCodes.OK, 'General overview saved successfully', savedGeneralOverview));
            
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
