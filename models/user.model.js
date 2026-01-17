const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // --- BASIC INFO ---
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    profilePic: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
    bio: { type: String, default: "Ready to innovate." },

    // --- ROLES & PERMISSIONS ---
    role: {
        type: String,
        enum: ['talent', 'client', 'admin'],
        default: 'talent'
    },
    isAdmin: { type: Boolean, default: false },

    // --- EMAIL VERIFICATION OTP (New) ---
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },

    // --- FORGOT PASSWORD OTP (Existing) ---
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;