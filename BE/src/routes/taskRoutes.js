const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  updateStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/addTask", verifyToken, createTask);
router.get("/getTasks", verifyToken, getTasks);
router.get("/getSingleTask/:id", verifyToken, getSingleTask);
router.put("/updateTask/:id", verifyToken, updateTask);
router.put("/updateStatus/:id", verifyToken, updateStatus);
router.delete("/deleteTask/:id", verifyToken, deleteTask);

module.exports = router;
