import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "voter", // default role
    adminCode: "", // for admin registration
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Only include adminCode if role is admin
      const payload = form.role === "admin"
        ? { ...form }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await API.post("/users/register", payload);
      alert(res.data.message);
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>

        {/* Show admin code input only if role is admin */}
        {form.role === "admin" && (
          <input
            type="text"
            name="adminCode"
            placeholder="Enter Admin Code"
            value={form.adminCode}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;