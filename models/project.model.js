const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// In models/project.model.js
const projectSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    status: { type: String, default: 'pending' },
    assignedTeam: { type: String, default: '' }, // <--- Add this line
    createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;