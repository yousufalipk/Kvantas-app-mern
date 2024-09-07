const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    imageName: {
        type: String,
        required: true,
    },
    reward: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const annoucement = mongoose.model('Announcement', announcementSchema, 'annoucements');
// Export the model
module.exports = annoucement;
