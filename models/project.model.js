const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'review', 'completed'],
        default: 'pending'
    },
    progress: { type: Number, default: 0 }, // 0 to 100
    assignedTeam: { type: String, default: "Allocating..." }, // Name of dev/team
    deadline: { type: Date }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;