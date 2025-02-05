import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/protectedRoutes";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/navbar";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Tasks from "./pages/tasks";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:projectId" element={<Tasks />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
