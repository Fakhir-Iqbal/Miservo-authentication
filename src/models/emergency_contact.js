
import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
    primary: {
        type: String,
        required: true
    },
    secondary: {
        type: String,
        required: true
    },
    other_1: {
        type: String,
        required: false
    },
    other_2: {
        type: String,
        required: false
    },
    added: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    }
}, {
    timestamps: true 
});

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;
