import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    beneficiary: {
        type: String, 
        required: true
    },
    description: {
        type: String
    }, // Corrected spelling from "discription" to "description"
    documents: {
        type: String,
        required: true
    },
    attorney: {
        type: Boolean, 
        default: false
     },
    courtInformation: {
        type: String
     },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });



const AssetModel = mongoose.model("Asset", assetSchema);
export default AssetModel;