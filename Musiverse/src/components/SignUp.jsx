// src/components/SignupModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert

const SignUp = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [msg, setMsg] = useState("");
  const [userFormData, setUserFormData] = useState([
    { fname: "", lname: "", email: "", password: "", phnno: "", gender: "" },
  ]);
  const [signindata, setsignindata] = useState([{ email: "", password: "" }]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" }); // New state for alert
  const navigate = useNavigate();

  function sendSignupData() {
    console.log("frontend signup");
    axios
      .post("http://localhost:8081/signupsubmit", userFormData)
      .then((response) => {
        console.log("signup form");
        if (response.data.msg === "Data inserted") {
          setAlert({
            open: true,
            message: "Signup successful!",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/home");
          }, 1000); // Redirect after 2 seconds
        } else {
          setAlert({
            open: true,
            message: response.data.msg,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 409) {
          setAlert({
            open: true,
            message: "User already exists",
            severity: "error",
          });
        } else {
          setAlert({
            open: true,
            message: "Error during signup",
            severity: "error",
          });
        }
      });
  }

  function sendSignIn() {
    axios
      .post("http://localhost:8081/signinsubmit", signindata)
      .then((response) => {
        if (response.data.msg === "Login successful") {
          localStorage.setItem("token", response.data.token);
          setAlert({
            open: true,
            message: "Login successful!",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/home");
          }, 1000); // Redirect after 2 seconds
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setAlert({
              open: true,
              message: "First register to login",
              severity: "error",
            });
          } else if (error.response.status === 401) {
            setAlert({
              open: true,
              message: "Password is wrong",
              severity: "error",
            });
          } else {
            setAlert({
              open: true,
              message: "Error during login",
              severity: "error",
            });
          }
        } else {
          setAlert({
            open: true,
            message: "Unable to connect to server",
            severity: "error",
          });
        }
      });
  }

  function verifyToken() {
    axios
      .post(
        "http://localhost:8081/verifytoken",
        {},
        { headers: { "x-access-token": localStorage.getItem("tokenkey") } }
      )
      .then((response) => {
        setMsg(response.data.msg);
      })
      .catch((error) => setMsg(error.message));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <div>{msg}</div>
        {/* Toggle between Sign Up and Sign In */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsSignUp(true)}
            className={`py-2 px-4 font-semibold ${
              isSignUp
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsSignUp(false)}
            className={`py-2 px-4 font-semibold ${
              !isSignUp
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {isSignUp ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your first name"
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, fname: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your last name"
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, lname: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your phone number"
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, phnno: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Gender
                </label>
                <select
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setsignindata({ ...signindata, email: e.target.value })
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
                  onChange={(e) =>
                    setsignindata({
                      ...signindata,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                isSignUp ? sendSignupData() : sendSignIn();
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
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

export default SignUp;
