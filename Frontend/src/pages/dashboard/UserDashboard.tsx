// src/pages/dashboard/UserDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (name && email) {
      setUser({ name, email });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Your Account</h2>
        {user && (
          <>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-4"><strong>Email:</strong> {user.email}</p>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}