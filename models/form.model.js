const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    // --- Step 1: Identity Verification ---
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate applications
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 13,
        max: 99
    },
    city: {
        type: String,
        required: true
    },
    discordUsername: {
        type: String,
        required: true
    },

    // --- Step 2: Neural Alignment ---
    primarySkillset: {
        type: String,
        required: true,
        enum: ['dev', 'design', 'marketing', 'video', 'other'] // Limits to your HTML options
    },
    startupIdea: {
        type: String,
        default: 'No'
    },
    portfolioLink: {
        type: String,
        trim: true
    },
    yearsExperience: {
        type: Number,
        default: 0
    },
    preferredLanguage: {
        type: String
    },

    // --- Step 3: Operational Capacity ---
    weeklyAvailability: {
        type: Number, // Hours per week
        required: true
    },
    workStyle: {
        type: String,
        enum: ['team', 'solo', 'both'],
        required: true
    },
    biggestWeakness: {
        type: String
    },
    longTermGoal: {
        type: String
    },
    referralSource: {
        type: String
    },

    // --- Step 4: Final Protocol ---
    whyNovaa: {
        type: String,
        required: true
    },
    termsAccepted: {
        type: Boolean,
        required: true
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;