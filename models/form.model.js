const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    lang: { type: String, required: true },

    educationStatus: { type: String, required: true },
    studentClass: { type: String },
    collegeCourse: { type: String },
    collegeYear: { type: String },

    linkedinLink: { type: String, trim: true },
    portfolioLink: { type: String, trim: true },

    motive: { type: String },
    department: { type: String, required: true },
    preferredLanguage: { type: String },
    prTeam: { type: String },
    otherDepartment: { type: String },

    weeklyAvailability: { type: Number },
    longTermGoal: { type: String },
    referralSource: { type: String, required: true },

    timeToLearn: { type: String },
    whyNovaa: { type: String },
    termsAccepted: { type: Boolean, required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected'],
        default: 'pending'
    },

    assignedRole: { type: String, default: '' },
    assignedTeam: { type: String, default: '' },
    assignedLeader: { type: String, default: '' },
    assignedPost: { type: String, default: '' },
    adminMessage: { type: String, default: '' },
    assignedWork: { type: String, default: '' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormData', formSchema, 'applications');