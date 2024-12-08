import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/adminlogin", adminData)
      .then((response) => {
        if (response.data.msg === "Admin login successful") {
          localStorage.setItem("token", response.data.token);
          setAlert({
            open: true,
            message: "Admin login successful!",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/admin-dashboard"); // Redirect to admin dashboard
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setAlert({
              open: true,
              message: "Invalid email or password",
              severity: "error",
            });
          } else if(error.response.status === 404) {
            setAlert({
              open: true,
              message: "Error during admin login",
              severity: "error",
            });
          }
        } else  {
          setAlert({
            open: true,
            message: "Unable to connect to server",
            severity: "error",
          });
        }
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleAdminLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Enter your email"
              value={adminData.email}
              onChange={(e) =>
                setAdminData({ ...adminData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
              placeholder="Enter your password"
              value={adminData.password}
              onChange={(e) =>
                setAdminData({ ...adminData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Login
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLoginModal;
