import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./views/register/Register";
import Login from "./views/login/Login";
import TaskDashboard from "./views/register/TaskDashboard";
import AddTask from "./views/task/AddTask";
import ViewTask from "./views/task/ViewTask";
import EditTask from "./views/task/EditTask";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./views/register/ForgotPassword";


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="forgetPassword" element={<ForgotPassword />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TaskDashboard />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/create-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/view-task"
            element={
              <ProtectedRoute>
                <ViewTask />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
