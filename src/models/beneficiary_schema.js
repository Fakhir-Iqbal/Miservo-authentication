import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^[0-9]{6,15}$/, // Allow only numeric strings of 6 to 15 digits
    },
    whatsappNumber: {
        type: String,
        required: false,
        match: /^[0-9]{6,15}$/, // Optional, numeric strings of 6 to 15 digits
    },
    relationShip: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Valid email format
    },
    anotherEmail: {
        type: String,
        required: false,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Optional, valid email format
    },
    firstAddress: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    secondAddress: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 200,
    },
    assetsAssigned: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });



const BeneficiaryModel = mongoose.model("beneficiary", BeneficiarySchema);

export default BeneficiaryModel;
