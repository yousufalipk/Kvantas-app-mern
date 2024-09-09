const express = require('express')
const { PORT, FRONTEND_ORIGIN } = require('./Config/env');
const ConnectToDB = require('./Config/db');
const cors = require('cors');

const userRoutes = require('./Routes/userRoutes');

const app = express();
app.use(express.json());


// CORS configuration
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}));

ConnectToDB();

// test route
app.get('/', (req, res)=> {
    return res.json('Server Running...')
})

app.use('/', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})