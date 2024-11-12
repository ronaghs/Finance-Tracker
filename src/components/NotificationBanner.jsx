import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Slide } from "@mui/material";

const NotificationBanner = ({ goals }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [marginTop, setMarginTop] = useState("20%");

  useEffect(() => {
    // Adjust marginTop dynamically based on screen size
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        // Mobile: Use 25% margin
        setMarginTop("25%");
      } else {
        // Desktop: Use 20% margin
        setMarginTop("10%");
      }
    };

    // Set the initial marginTop and add event listener for resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Check if the notification has already been shown in this session
    const notificationShown = sessionStorage.getItem("notificationShown");

    if (goals && goals.length > 0 && !notificationShown) {
      setShowBanner(true);
      sessionStorage.setItem("notificationShown", "true"); // Set flag in sessionStorage

      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [goals]);

  const handleClose = () => setShowBanner(false);

  if (!showBanner) return null;

  return (
    <Slide direction="down" in={showBanner} mountOnEnter unmountOnExit>
      <div
        className="fixed inset-0 flex items-start justify-center z-50"
        style={{ marginTop }} // Dynamically set marginTop
        aria-live="polite"
      >
        <div className="w-11/12 max-w-md px-4">
          <Alert
            severity="info"
            onClose={handleClose}
            className="text-sm sm:text-base lg:text-lg rounded-lg shadow-md text-center"
          >
            Welcome! Check your goals to see your progress!
          </Alert>
        </div>
      </div>
    </Slide>
  );
};

NotificationBanner.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      saved: PropTypes.number.isRequired,
      endDate: PropTypes.string.isRequired,
    })
  ),
};

export default NotificationBanner;
