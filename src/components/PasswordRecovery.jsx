import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseconfig"; // Import Firebase auth instance
import { Button, TextField, Alert } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "If an account with this email exists, a password reset link will be sent shortly!"
      );
    } catch (err) {
      console.error(err);
      setError(
        "Failed to send password reset email. Check the email address and try again."
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ResponsiveAppBar />
      <div className="flex justify-center items-center h-full">
        <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md mt-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Password Recovery
          </h2>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" className="mb-4">
              {message}
            </Alert>
          )}
          <form onSubmit={handlePasswordReset}>
            <TextField
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              className="mb-4"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-500 text-white py-2 hover:bg-blue-700"
            >
              Send Password Reset Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
