import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const SavingsNotification = ({ notification, setNotification }) => {
  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={5000}
      onClose={() => setNotification(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      className="fade-in"
    >
      <Alert
        severity="info"
        onClose={() => setNotification(null)}
        sx={{
          whiteSpace: "pre-line",
          fontSize: "1.2rem",
          fontWeight: "bold",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {notification}
      </Alert>
    </Snackbar>
  );
};

SavingsNotification.propTypes = {
  notification: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default SavingsNotification;
