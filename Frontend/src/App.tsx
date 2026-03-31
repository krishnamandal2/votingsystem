import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VoterDashboard from "./pages/dashboard/VoterDashboard";
import ElectionList from "./pages/ElectionList";
import ElectionDetails from "./pages/ElectionDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserDashboard from "./pages/dashboard/UserDashboard";
import Account from "./pages/Account";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Voter Route - Main dashboard for voters */}
        <Route
          path="/voter"
          element={
            <ProtectedRoute role="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* User Dashboard Route - Generic user account page */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Public Election Routes */}
        <Route path="/elections" element={<ElectionList />} />
        <Route path="/election/:id" element={<ElectionDetails />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;