const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:path.join(__dirname, 'config', 'config.env')});

// Routes Include
const authRoutes = require("./routes/authRoutes");
const masterRoutes = require("./routes/masterRoutes");
const userRoutes = require("./routes/userRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/auth', authRoutes);

app.use('/master', authMiddleware, masterRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/leave', authMiddleware, leaveRoutes);


app.listen(process.env.PORT, (err)=>{
    if(err) throw err;
    console.log(`Server port is ${process.env.PORT} and Environment is ${process.env.NODE_ENV}`)
});