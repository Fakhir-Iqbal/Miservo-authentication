import { BeneficiaryModel } from "../models/index.js";
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";

export default async function editBeneficiary(req, res) {
    const { id } = req.params;

    if (!id) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(createRes(StatusCodes.BAD_REQUEST, 'Beneficiary ID is required'));
    }

    const updatedData = req.body;

    try {
        const updatedBeneficiary = await BeneficiaryModel.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        
        if (!updatedBeneficiary) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json(createRes(StatusCodes.NOT_FOUND, 'Beneficiary not found'));
        }

        return res
            .status(StatusCodes.OK)
            .json(createRes(StatusCodes.OK, 'Beneficiary updated successfully', updatedBeneficiary));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, error.message.replaceAll('`', '')));
    }
}
