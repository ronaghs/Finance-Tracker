import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { FcGoogle } from "react-icons/fc";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseconfig"; // Ensure the Firebase config is properly imported.

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Firebase sign-in using email and password
  const signIn = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Firebase Google sign-in
  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    setModalOpen(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed");
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <ResponsiveAppBar />
      <ThemeProvider theme={createTheme()}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                backgroundImage:
                  "linear-gradient(to left, #644fd5, #6aabe2, #c865d4)",
              }}
            >
              <AccountBalanceWalletIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={signIn} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* "Forgot password?" link placed right-aligned under password field */}
              <Grid container justifyContent="flex-end">
                <NavLink
                  to="/password-recovery" // Password recovery page link
                  style={{
                    color: "blue",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </NavLink>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "blueGrey" }}
                onClick={signInWithGoogle}
              >
                Continue with Google <FcGoogle className="googleIcon" />
              </Button>

              <Grid container justifyContent="left">
                <Grid item>
                  <NavLink
                    to="/signup"
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Don&apos;t have an account? Sign Up
                  </NavLink>
                </Grid>
              </Grid>

              {/* Testing info moved below the "Don't have an account?" link */}
              <p style={{ textAlign: "left", marginTop: "10px" }}>
                username: test@mail.com
                <br />
                password: 123456
              </p>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="loading-modal-title"
        aria-describedby="loading-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "blue" }} />
        </Box>
      </Modal>
    </motion.div>
  );
}

export default LoginPage;
