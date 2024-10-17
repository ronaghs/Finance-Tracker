import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

// Firebase Authentication Imports
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseconfig"; // Ensure the correct path to firebaseConfig

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Goals", path: "/goals" },
  { label: "Expenses", path: "/expenses" },
  { label: "Income", path: "/income" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  // Firebase Authentication: Set up an observer on Auth object to check if user is logged in or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user); // Set loggedIn to true if user exists, false otherwise
    });

    return () => {
      unsubscribe(); // Cleanup subscription on component unmount
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setShowLogoutConfirmation(true);
      setTimeout(() => {
        navigate("/login"); // Redirect to sign-in page after logout
      }, 1500);
    } catch (err) {
      console.error("Logout error:", err); // Catch and log any errors during sign-out
    }
  };

  return (
    <AppBar id="navbar" position="sticky">
      <Container
        className="bg-gradient-to-l from-blue-500 to-purple-600"
        maxWidth="xlg"
      >
        <Toolbar className="toolBar" disableGutters>
          <AccountBalanceWalletIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              ml: { lg: 18, m: 5 },
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Finance Tracker
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {loggedIn && (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  component={NavLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 0,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Finance Tracker
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(
              (page) =>
                loggedIn && (
                  <Button
                    key={page.label}
                    component={NavLink}
                    to={page.path}
                    activeclassname="active"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.label}
                  </Button>
                )
            )}
          </Box>

          {/* Logout or login based on user state */}
          <Box className="accountIcon">
            {loggedIn ? (
              <Button
                id="logoutButton"
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <NavLink to="/login">
                <IconButton>
                  <AccountCircleIcon fontSize="large" alt="Account" />
                </IconButton>
              </NavLink>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Snackbar
        open={showLogoutConfirmation}
        autoHideDuration={3000}
        onClose={() => setShowLogoutConfirmation(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setShowLogoutConfirmation(false)}
          severity="success"
        >
          Logging you out
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
