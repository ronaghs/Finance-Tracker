import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";
import Grow from "@mui/material/Grow";

const NotificationSystem = ({ goals }) => {
  const [notifications, setNotifications] = useState([]); // Notifications to display
  const [shownNotifications, setShownNotifications] = useState({}); // Tracks already shown notifications

  useEffect(() => {
    if (!goals || goals.length === 0) return; // Skip if no goals

    const newNotifications = [];
    const updatedShownNotifications = { ...shownNotifications }; // Clone for updates

    goals.forEach((goal) => {
      const progress = (goal.saved / goal.amount) * 100; // Progress percentage
      const daysRemaining = Math.ceil(
        (new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      ); // Days left to the goal deadline

      // Add notifications for specific milestones
      if (
        progress >= 50 &&
        progress < 90 &&
        !updatedShownNotifications[`${goal.id}-halfway`]
      ) {
        newNotifications.push(
          `You're halfway there on your goal: ${goal.category}!`
        );
        updatedShownNotifications[`${goal.id}-halfway`] = true;
      }

      if (
        progress >= 90 &&
        progress < 100 &&
        !updatedShownNotifications[`${goal.id}-almost-there`]
      ) {
        newNotifications.push(
          `Almost there! Only ${(goal.amount - goal.saved).toFixed(
            2
          )} left for ${goal.category}!`
        );
        updatedShownNotifications[`${goal.id}-almost-there`] = true;
      }

      if (
        progress < 50 &&
        daysRemaining <= 7 &&
        !updatedShownNotifications[`${goal.id}-deadline`]
      ) {
        newNotifications.push(
          `Your goal "${goal.category}" is approaching its deadline. Only ${daysRemaining} days left!`
        );
        updatedShownNotifications[`${goal.id}-deadline`] = true;
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(newNotifications); // Update notifications
      setShownNotifications(updatedShownNotifications); // Update shown notifications
    }
  }, [goals, shownNotifications]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return; // Don't close on click outside
    setNotifications([]); // Clear notifications when closed
  };

  return (
    <div>
      {notifications.map((message, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={5000} // Duration set to 5 seconds
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Center horizontally
          TransitionComponent={Grow} // Smooth grow animation
          sx={{ marginTop: "10vh" }} // 10% lower from the top of the viewport
        >
          <Alert
            onClose={handleClose}
            severity="info" // Type of alert
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

NotificationSystem.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Goal ID
      category: PropTypes.string.isRequired, // Goal category
      amount: PropTypes.number.isRequired, // Target amount
      saved: PropTypes.number.isRequired, // Saved amount
      endDate: PropTypes.string.isRequired, // Goal end date
    })
  ).isRequired,
};

export default NotificationSystem;
