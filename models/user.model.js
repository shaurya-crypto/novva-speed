const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    role: {
        type: String,
        enum: ['talent', 'client', 'admin'],
        default: 'talent'
    },

    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },

    isAdmin: { type: Boolean, default: false },
    bio: { type: String, default: "Ready to innovate." },
    profilePic: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;