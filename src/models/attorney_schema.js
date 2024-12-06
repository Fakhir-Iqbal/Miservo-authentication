import mongoose from 'mongoose';

const attorneySchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: { 
        type: String,
        required: true
    },
    companyPhoneNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    officeEmail: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    officeLocation: {
        type: String,
        required: true
    },
    officeAddress: {
        type: String,
        required: true
    },
    added: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const AttorneyModel = mongoose.model("Attorney", attorneySchema);
export default AttorneyModel;