import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Snackbar,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editedFirstname, setEditedFirstname] = useState("");
  const [editedLastname, setEditedLastname] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  // Fetch all users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/all-users");
        setUsers(response.data);
      } catch (err) {
        showAlert("error", "Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  // Handle deleting a user
  // Handle deleting a user
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete("http://localhost:8081/delete-user", {
      data: { userId },
    });
    if (response.data.success) {
      showAlert("success", "User deleted successfully!");
      // Refresh the page after deletion
      setTimeout(() => {
        window.location.reload();  // This will refresh the page
      }, 2000); // Wait for 2 seconds to let the alert show up before refreshing
    } else {
      showAlert("error", "Failed to delete user.");
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Failed to delete user.");
  }
};


  // Handle opening the edit form
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditedFirstname(user.firstname);
    setEditedLastname(user.lastname);
    setEditedEmail(user.email);
    setEditedPhone(user.phone);
  };

  // Handle saving the updated user
  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("http://localhost:8081/update-user", {
        _id: editingUser._id,
        firstname: editedFirstname,
        lastname: editedLastname,
        email: editedEmail,
        phone: editedPhone,
      });
      if (response.data.success) {
        showAlert("success", "User updated successfully!");
        setUsers(
          users.map((user) =>
            user._id === editingUser._id
              ? { ...user, firstname: editedFirstname, lastname: editedLastname, email: editedEmail, phone: editedPhone }
              : user
          )
        );
        setEditingUser(null);
      } else {
        showAlert("error", "Failed to update user.");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to update user.");
    }
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Users</h2>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <ul className="space-y-6">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="border-b border-gray-700 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-xl">{`${user.firstname} ${user.lastname}`}</strong>
                  <br />
                  <em className="text-gray-400">{user.email}</em>
                  <br />
                  <span className="text-gray-400">{user.phone}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleEditClick(user)}
                    sx={{
                      width: "120px", // Ensures the same width for both buttons
                      padding: "8px 16px", // Adjust padding for consistency
                      fontWeight: "bold", // Optional: to make the text bold
                    }}
                    className="text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(user._id)}
                    sx={{
                      width: "120px", // Ensures the same width for both buttons
                      padding: "8px 16px", // Adjust padding for consistency
                      fontWeight: "bold", // Optional: to make the text bold
                    }}
                    className=" text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No users available.</p>
        )}
      </ul>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingUser)} onClose={handleCancelEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            value={editedFirstname}
            onChange={(e) => setEditedFirstname(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Last Name"
            fullWidth
            value={editedLastname}
            onChange={(e) => setEditedLastname(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            value={editedPhone}
            onChange={(e) => setEditedPhone(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Allusers;
