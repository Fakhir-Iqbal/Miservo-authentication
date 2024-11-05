import { UserModel } from "./../../models/index.js";
import bcrypt from 'bcrypt'
import { createRes } from "./../../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export default async function resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await UserModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if the token is still valid
        });

        if (!user) {
            return res.status(400).json(createRes(StatusCodes.FORBIDDEN, 'Invalid Token'));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        user.password = hash;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return res.status(200).json(createRes(StatusCodes.OK, 'Password has been reset successfully'));
    } catch (error) {
        if (error.message) {
            return res.status(StatusCodes.FORBIDDEN).json(createRes(StatusCodes.FORBIDDEN, error.message));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR));
    }
};