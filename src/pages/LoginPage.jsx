import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  //TODO: Error should be resolved once Firebase is setup.
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  //TODO: Remove after setting up Firebase auth sign in
  // Placeholder for a sign in function
  const signIn = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    //TODO: Remove after setting up Firebase auth sign in
    // Placeholder. Simulates a successful login
    setTimeout(() => {
      setLoading(false);
      navigate("/Dashboard");
    }, 1000);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    setModalOpen(true);

    //TODO: Simulate Google sign-in, remove after Firebase setup
    setTimeout(() => {
      setLoading(false);
      setModalOpen(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div>
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* TODO: Remove <p></p> once firebase is set up */}
              <p>
                Just click the sign in button to be "logged in" for now. No
                credentials needed
              </p>
              <Typography sx={{ textAlign: "center" }} variant="h6">
                OR
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "blueGrey" }}
                onClick={signInWithGoogle}
              >
                Continue with Google <FcGoogle className="googleIcon" />
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* TODO: Add logic for password recovery */}
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
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
                    Don't have an account? Sign Up
                  </NavLink>
                  <p>
                    Demo credentials (add later to let people sign in and check
                    things out w/out having to create an account)
                    <br />
                    username:
                    <br />
                    password:
                  </p>
                </Grid>
              </Grid>
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
    </div>
  );
}

export default LoginPage;
