import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VoterDashboard from "./pages/dashboard/VoterDashboard";
import ElectionList from "./pages/ElectionList";
import ElectionDetails from "./pages/ElectionDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter"
          element={
            <ProtectedRoute role="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/elections" element={<ElectionList />} />
        <Route path="/election/:id" element={<ElectionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;