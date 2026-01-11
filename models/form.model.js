const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 13, max: 40 },
    city: { type: String, required: true },
    lang: { type: String, required: true },

    educationStatus: {
        type: String,
        required: true,
        enum: ['school', 'college', 'graduated']
    },
    studentClass: { type: String },
    collegeCourse: { type: String },
    collegeYear: { type: String },

    linkedinLink: { type: String, required: true, trim: true },
    portfolioLink: { type: String, trim: true },

    motive: { type: String },
    department: { type: String },
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
    }

}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;