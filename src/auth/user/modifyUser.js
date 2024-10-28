import { UserModel } from './../../models/index.js'
import { createRes } from './../../utils/index.js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose';


const modifyUser = async (req, res) => {
    
    const {Types: {ObjectId}} = mongoose;

    const validateObjectId = (id) => ObjectId.isValid(id) && (new ObjectId(id)).toString() === id; //true or false
    const { id } = req.params

    if (req.body.password) {
        return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, "password cannot edit"))
    }

    try {
        
        if (!validateObjectId(id)) {
            throw new Error('id-error')
        }

        const updatedResourse = await UserModel.findByIdAndUpdate({_id: id}, req.body, {new: true});

        if (updatedResourse) {
            return res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, updatedResourse))
        } else {
            return res.status(StatusCodes.NOT_FOUND).json(createRes(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND))
        }
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN,Object.keys(error.keyValue)[0] + " is already registered"));
        }
        
        if (error.message === 'id-error') {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json(createRes(StatusCodes.NOT_ACCEPTABLE, 'invalid user id'))
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
    }
}

export default modifyUser