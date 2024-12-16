// import { BeneficiaryModel } from "../models/index.js";
// import { createRes } from "../utils/index.js";
// import { StatusCodes } from "http-status-codes";
// import { decodeToken } from "../utils/index.js";


// export const saveBeneficiary = async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     const { _id } = decodeToken(token);

//     let dataToSave = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         contactNumber: req.body.contactNumber,
//         whatsappNumber: req.body.whatsappNumber,
//         relationShip: req.body.relationShip,
//         email: req.body.email,
//         anotherEmail: req.body.anotherEmail,
//         firstAddress: req.body.firstAddress,
//         secondAddress: req.body.secondAddress,
//         assetsAssigned: req.body.assetsAssigned,
//         addedBy: _id
//     };
    
//     try {
//         const beneficiary = new BeneficiaryModel({ dataToSave });
//         const savedBeneficiary = await beneficiary.save();

//         if (!saveBeneficiary) {
//             return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'Failed to save data'));
//         }

//         delete saveBeneficiary.__v
//         delete saveBeneficiary.addedBy

//         return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Beneficiary saved successfully', savedBeneficiary));
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, 'Error saving beneficiary', error.message,));
//     }
// };

import { BeneficiaryModel } from "../models/index.js";
import { createRes } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { decodeToken } from "../utils/index.js";

export const saveBeneficiary = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { _id } = decodeToken(token);

    let dataToSave = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        whatsappNumber: req.body.whatsappNumber,
        relationShip: req.body.relationShip,
        email: req.body.email,
        anotherEmail: req.body.anotherEmail,
        firstAddress: req.body.firstAddress,
        secondAddress: req.body.secondAddress,
        assetsAssigned: req.body.assetsAssigned,
        addedBy: _id
    };
    
    try {
        const beneficiary = new BeneficiaryModel(dataToSave);
        const savedBeneficiary = await beneficiary.save();
        
        if (!savedBeneficiary) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, 'Failed to save data'));
        }

        const cleanedBeneficiary = savedBeneficiary.toObject();
        delete cleanedBeneficiary.__v;
        delete cleanedBeneficiary.addedBy;

        return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, 'Beneficiary saved successfully', cleanedBeneficiary));
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(createRes(StatusCodes.BAD_REQUEST, 'Error saving beneficiary', error.message));
    }
};
