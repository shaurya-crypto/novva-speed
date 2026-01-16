const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: { type: String, default: 'update' }, // update, alert, event
    createdAt: { type: Date, default: Date.now },
    // New: Store replies
    replies: [{
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Announcement', announcementSchema);