const dotenv = require('dotenv');
dotenv.config()

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

module.exports = {
    PORT,
    MONGODB_URI,
    FRONTEND_ORIGIN,
    TELEGRAM_BOT_TOKEN,
    CHAT_ID
}