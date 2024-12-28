const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:path.join(__dirname, 'config', 'config.env')});


// Middleware
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const authMiddleware = require("./middleware/authMiddleware");

// Routes Include
const authRoutes = require("./routes/authRoutes");
const masterRoutes = require("./routes/masterRoutes");
const userRoutes = require("./routes/userRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Routes Setup
app.use('/auth', authRoutes);

app.use('/master', authMiddleware, masterRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/leave', authMiddleware, leaveRoutes);
app.use('/announcement', authMiddleware, announcementRoutes);
app.use('/project', authMiddleware, projectRoutes);
app.use('/dashboard', authMiddleware, dashboardRoutes);


app.listen(process.env.PORT, (err)=>{
    if(err) throw err;
    console.log(`Server port is ${process.env.PORT} and Environment is ${process.env.NODE_ENV}`)
});