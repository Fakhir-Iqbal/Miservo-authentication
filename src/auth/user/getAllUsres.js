import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { createRes } from "../../utils/index.js"
import { UserModel } from "../../models/index.js"


const getAllUsers = async (req, res) => {
    const { limit, skip, sortby } = req.query
    
    try {
        const allUser = await UserModel.find({type: 'user'}).select('-password').select("-__v").sort(sortby ? sortby : "name").skip(skip ? skip : 0).limit(limit ? limit : 50)

        if (allUser && allUser.length > 0) {
            res.status(StatusCodes.OK).json(createRes(StatusCodes.OK, ReasonPhrases.OK, allUser))
        } else {
            res.status(StatusCodes.OK).json(createRes(StatusCodes.NOT_FOUND, 'No record found'))
        }

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR))
    }
}

export default getAllUsers;