const express = require('express')
const { PORT } = require('./Config/env');
const ConnectToDB = require('./Config/db');

const userRoutes = require('./Routes/userRoutes');

const app = express();
app.use(express.json());

ConnectToDB();



// test route
app.get('/', (req, res)=> {
    return res.json('Server Running...')
})

app.use('/', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})