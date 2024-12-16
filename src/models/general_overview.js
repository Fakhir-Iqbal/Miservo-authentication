import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema Definition
const generalOverviewSchema = new Schema({
    firstName: {
        type: String,
        equired: true

    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', false],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    anotherAddress: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'User'
    },
});

const GeneralOverview = model('GeneralOverview', generalOverviewSchema);

export default GeneralOverview;
