import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    deploymentUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['deploying', 'ready', 'error'],
        default: 'deploying'
    },
    vercelDeploymentId: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    error: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Deployment = mongoose.model("deployment", deploymentSchema);

export default Deployment;
