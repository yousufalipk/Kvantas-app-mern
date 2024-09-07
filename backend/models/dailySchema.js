const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    reward: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

const daily = mongoose.model('DailyTasks', dailyTaskSchema, 'dailyTasks');

module.exports = daily;
