import mongoose from "mongoose";
import { AssetModel } from "../models/index.js";
import { BeneficiaryModel } from "../models/index.js";
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";


export default async function pullAsset(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(createRes(StatusCodes.UNAUTHORIZED, 'Token is required'));
    }

    const { _id }  = decodeToken(token);

    try {
        const { skip = 0, limit = 10 } = req.query;

        const result = await AssetModel.aggregate([
            {
                $match: { added: new mongoose.Types.ObjectId(_id) }
            },
            {
                $skip: parseInt(skip)
            },
            {
                $limit: parseInt(limit)
            },
            {
                $lookup: {
                    from: 'beneficiaries', // name of the collection for BeneficiaryModel
                    localField: 'beneficiary', // field in AssetModel
                    foreignField: '_id', // field in BeneficiaryModel
                    as: 'beneficiaryDetails' // alias for the joined data
                }
            },
            {
                $unwind: {
                    path: '$beneficiaryDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        if (!result.length) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json(createRes(StatusCodes.NOT_FOUND, 'Data not found'));
        }
        
        result.forEach(v => {
            delete v.addedBy
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
