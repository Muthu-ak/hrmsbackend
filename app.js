const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:path.join(__dirname, 'config', 'config.env')});
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use('/auth', authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use('/user', userRoutes);

app.listen(process.env.PORT, (err)=>{
    if(err) throw err;
    console.log(`Server port is ${process.env.PORT} and Environment is ${process.env.NODE_ENV}`)
});