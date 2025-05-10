const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const locationRoutes = require("./routes/locationRoutes");
const partRoutes = require("./routes/partRoutes");
const complainRoutes = require("./routes/complainRoutes");
const technicianduedateRoutes=require("./routes/technicianduedateRoutes");
const refillerduedateRoutes=require("./routes/refillerduedateRoutes");
const technicianpendingtaskRoutes = require("./routes/technicianpendingtaskRoutes");
const techniciannewtaskRoutes=require("./routes/techniciannewtaskRoutes");
const technicianComplaintRoutes=require("./routes/technicianComplaintRoutes");
const refillerpendingtaskRoutes = require("./routes/refillerpendingtaskRoutes");
const refillernewtaskRoutes=require("./routes/refillernewtaskRoutes");
const refillerComplaintRoutes=require("./routes/refillerComplaintRoutes");
const clientComplaintRoutes=require("./routes/clientComplaintRoutes");
const adminComplaintRoues=require("./routes/adminComplaintRoutes");
const { pool } = require("./db");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api", locationRoutes);
app.use("/api", partRoutes);
app.use("/api", complainRoutes);
app.use("/api",technicianduedateRoutes);
app.use("/api",refillerduedateRoutes);
app.use("/api", technicianpendingtaskRoutes);
app.use("/api", techniciannewtaskRoutes);
app.use("/api",technicianComplaintRoutes);
app.use("/api", refillerpendingtaskRoutes);
app.use("/api", refillernewtaskRoutes);
app.use("/api", refillerComplaintRoutes);
app.use("/api",clientComplaintRoutes);
app.use("/api",adminComplaintRoues);

app.listen(5000, () => console.log("Server running on port 5000"));