import { UserModel } from "./../../models/index.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { createRes } from "../../utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";


dotenv.config()

export default async function forgetPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json(createRes(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, 'user not found'));
        }


        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please click the link to reset your password: 
          http://yourdomain.com/reset-password/${resetToken}`,
        };

        const sentEMail = await transporter.sendMail(mailOptions);
        console.log('email ---->', sentEMail)
        res.status(200).json(createRes(StatusCodes.OK, 'Password reset email sent', { acceptedby: sentEMail.accepted[0], res: sentEMail.response }));
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createRes(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR));
    }
}