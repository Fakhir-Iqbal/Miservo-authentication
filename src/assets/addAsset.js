import { AssetModel } from "../models/index.js";
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";


export default async function saveAsset (req, res) {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const { _id } = decodeToken(token);

        if (!_id) {
            return res.status(StatusCodes.UNAUTHORIZED).json(createRes(StatusCodes.UNAUTHORIZED, 'Token is required'));
        }

        const { title, beneficiary, description, documents, attorney, courtInformation } = req.body;

        const newAsset = new AssetModel({
            title,
            beneficiary,
            description,
            // documents,
            attorney,
            courtInformation,
            addedBy: _id
        });

        const savedAsset = await newAsset.save();

        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Asset saved successfully', savedAsset));
    } catch (error) {
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