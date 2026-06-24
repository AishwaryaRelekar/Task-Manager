const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api/task",taskRoutes)

const port = process.env.PORT;

app.listen(port, () => console.log(`server connected ${port}`));
