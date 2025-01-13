import cron from "node-cron";
import { sendEmail } from "./src/utils/emailService.js";
import { UserModel, BeneficiaryModel } from "./src/models/index.js";
import chalk from "chalk";

// Cron job to run every day at midnight
export const scheduleCronJob = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log(chalk.white.bgYellow("---- Running cron job ----"));

        try {
            const users = await UserModel.find();
            const today = new Date();

            users.forEach(async (user) => {
                const userDate = new Date(user.date);
                let sendMail = false;

                if (user.checkInDuration === "weekly") {
                    const nextWeek = new Date(userDate);
                    nextWeek.setDate(nextWeek.getDate());

                    if (today.toDateString() === nextWeek.toDateString()) {
                        sendMail = true;
                    }
                } else if (user.checkInDuration === "monthly") {
                    const nextMonth = new Date(userDate);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);

                    if (today.toISOString().split('T')[0] === nextMonth.toISOString().split('T')[0]) {
                        sendMail = true;
                    }
                } else if (user.checkInDuration === "yearly") {
                    const nextYear = new Date(userDate);
                    nextYear.setFullYear(nextYear.getFullYear() + 1);

                    if (today.toISOString().split('T')[0] === nextYear.toISOString().split('T')[0]) {
                        sendMail = true;
                    }
                }

                if (sendMail) {
                    await sendEmail(user.email);
                }
            });
        } catch (error) {
            console.error("Error running cron job:", error);
        }
    });

    console.log(chalk.white.bgMagenta("---- Cron job scheduled ----"));
};








const calculateAssignedDate = (date, assignedTo) => {
    const currentDate = new Date(date);
    switch (assignedTo) {
        case 'After Weekly':
            currentDate.setDate(currentDate.getDate());
            break;
        case 'After 2 Weeks':
            currentDate.setDate(currentDate.getDate() + 14);
            break;
        case 'After Month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        case 'After 3 Months':
            currentDate.setMonth(currentDate.getMonth() + 3);
            break;
        case 'After 5 Months':
            currentDate.setMonth(currentDate.getMonth() + 5);
            break;
        default:
            break;
    }
    return currentDate;
};


export const checkUsersAndSendEmails = async () => {
    cron.schedule('0 0 * * *', async () => {
        console.log(chalk.white.bgYellow("---- Running cron beneficiary job ----"));
        try {
            const users = await UserModel.find();

            users.forEach(async (user) => {

                const { date, assignedTo } = user
                let isSendEmail = false

                const assignedDueDate = calculateAssignedDate(date, assignedTo);

                if (new Date().toDateString() === assignedDueDate.toDateString()) {

                    if (!isSendEmail) {
                        await sendEmail(user.email);

                        const beneficiaries = await BeneficiaryModel.find({ addedBy: user._id });
                        await Promise.all(beneficiaries.map(async (beneficiary) => {
                            await sendEmail(beneficiary.email);
                        }));

                        isSendEmail = true;
                    }
                }

            })

        } catch (error) {
            console.error('Error in scheduled task:', error);
        }
    });
};


