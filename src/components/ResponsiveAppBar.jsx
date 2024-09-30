//TODO: A few declare errors. Leaving untouched till Firebase is sorted, as they will all be resolved once that is done.
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

// TODO: Reintroduce Firebase Auth imports later, since Firebase is not set up yet, site wont load.
/* import { signOut } from "firebase/auth";
import { auth } from "firebase/firebaseConfig"; */

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

//TODO: Placeholders for future navigation links in the navigation bar (you wont be able to see these until Firebase auth is set up to let the site know a user is logged in. We don't want to have these on display if a user is not signed in.)
const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Expenses", path: "/expenses" },
  { label: "Income", path: "/income" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);

  //TODO: Delcare error should resolve once Firebase is setup
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  //TODO: Uncomment once Firebase is set up. Site can't load if this is not commented out for now.
  /*  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []); */

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // TODO: Set up SignOut once Firebase is initialized
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirmation(true);
      setTimeout(() => {
        navigate("/signin");
      }, 1500); // 1.5 second delay before redirecting to signin page
    } catch (err) {
      console.error(err);
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

          {/* TODO: After Firebase is set up, this should be able to serve as the logout button/function */}
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
