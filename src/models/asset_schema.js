import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    beneficiary: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'beneficiary',
        required: true
    },
    description: {
        type: String
    },
    documents: {
        default: [],
        type: Array,
        // required: true
    },
    attorney: {
        type: Boolean, 
        default: false
     },
    courtInformation: {
        type: String
     },
    added: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });



const AssetModel = mongoose.model("Asset", assetSchema);
export default AssetModel;