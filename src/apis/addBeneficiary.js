import BeneficiaryModel from "./../models/beneficiary_schema.js";
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";


export const saveBeneficiary = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const _id = decodeToken(token);

    try {
        const beneficiaryData = req.body;
        const beneficiary = new BeneficiaryModel({...beneficiaryData, added: _id});
        const savedBeneficiary = await beneficiary.save();
        
        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Beneficiary saved successfully', savedBeneficiary));
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, 'Error saving beneficiary', error.message,));
    }
};