const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

const ConnectToDB = () => {
    mongoose.connect(MONGODB_URI)
    .then((val) => {
        console.log("Database connected successfully!");
    })
    .catch((error) => {
        console.log("Error connecting to the database!", error);
    });
};

module.exports = ConnectToDB;
