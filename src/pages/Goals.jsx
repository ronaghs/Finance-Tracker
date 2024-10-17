import { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Typography,
  LinearProgress,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Confetti from "react-confetti";

const FinancialGoals = () => {
  // State to manage goals and the new goal being added/edited
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    amount: "",
    category: "",
    endDate: "",
    saved: 0,
    contribution: 0,
  });
  const [open, setOpen] = useState(false); // Manages the dialog visibility
  const [editingGoal, setEditingGoal] = useState(null); // Track which goal is being edited
  const [showConfetti, setShowConfetti] = useState(false); // Flag for confetti display

  // Open the Add/Edit Goal dialog
  const handleOpen = () => setOpen(true);

  // Close dialog and reset newGoal state
  const handleClose = () => {
    setOpen(false);
    setNewGoal({
      amount: "",
      category: "",
      endDate: "",
      saved: 0,
      contribution: 0,
    });
    setEditingGoal(null);
  };

  // Save a new goal or update an existing one
  const handleSave = () => {
    if (editingGoal !== null) {
      // Update existing goal
      const updatedGoals = goals.map((goal, index) =>
        index === editingGoal ? newGoal : goal
      );
      setGoals(updatedGoals);
    } else {
      // Add new goal
      setGoals([...goals, newGoal]);
    }
    handleClose();
  };

  // Goal data for editing
  const handleEdit = (index) => {
    setEditingGoal(index);
    setNewGoal(goals[index]);
    setOpen(true);
  };

  // Delete a goal from the list
  const handleDelete = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  // Handle the input change for contribution amount
  const handleContributionChange = (index, amount) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, contribution: amount } : goal
    );
    setGoals(updatedGoals);
  };

  // Apply the contribution amount and check if the goal is met
  const handleContribution = (index) => {
    const updatedGoals = goals.map((goal, i) => {
      if (i === index) {
        const newSaved = goal.saved + goal.contribution;
        if (newSaved >= goal.amount) {
          setShowConfetti(true); // Show confetti on goal completion
          setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
          alert("🎉 Congratulations! You've reached your goal! 🎉");
        }
        return { ...goal, saved: newSaved, contribution: 0 }; // Reset contribution after adding
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  // Calculate remaining days until the goal end date
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const goalDate = new Date(endDate);
    const timeDifference = goalDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  // Dynamically sets progress bar color based on progress
  const getProgressBarColor = (progress) => {
    if (progress >= 75) return "#4caf50"; // Green for 75%+
    if (progress >= 50) return "#ffeb3b"; // Yellow for 50%-75%
    return "#f44336"; // Red for below 50%
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-4">
      <ResponsiveAppBar />
      <Button
        variant="contained"
        onClick={handleOpen}
        className="mb-6 bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Add Goal
      </Button>
      {showConfetti && <Confetti />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const progress = (goal.saved / goal.amount) * 100;
          const cappedProgress = Math.min(progress, 100); // Cap progress at 100%
          const daysRemaining = calculateDaysRemaining(goal.endDate);

          return (
            <Card
              key={index}
              className="p-4 shadow-lg border border-gray-200 rounded-lg"
            >
              <CardContent>
                <Typography
                  variant="h6"
                  className="text-purple-500 font-semibold"
                >
                  {goal.category}
                </Typography>
                <div className="flex items-center mb-1">
                  <Typography className="text-gray-800 font-bold flex items-center mr-2">
                    🎯 Goal:{" "}
                    <span className="text-blue-600 ml-1">${goal.amount}</span>
                  </Typography>
                  <span className="mx-2 text-gray-400">|</span>

                  <Typography className="text-gray-800 font-bold flex items-center">
                    💵 Saved:{" "}
                    <span className="text-green-600 ml-1">${goal.saved}</span>
                  </Typography>
                </div>
                <Typography
                  className={`${
                    daysRemaining <= 3 ? "text-red-500" : "text-gray-800"
                  } font-bold mb-2 flex items-center`}
                >
                  ⏳{" "}
                  {daysRemaining > 0
                    ? `${daysRemaining} days remaining`
                    : `Goal Ended`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={cappedProgress}
                  className="my-2"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getProgressBarColor(cappedProgress),
                    },
                  }}
                />
                <Typography variant="body2" className="text-sm">{`${Math.round(
                  progress
                )}% of your goal reached`}</Typography>
              </CardContent>

              <CardActions>
                <TextField
                  placeholder="0"
                  type="number"
                  value={goal.contribution === 0 ? "" : goal.contribution}
                  onChange={(e) =>
                    handleContributionChange(index, Number(e.target.value))
                  }
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                  className="mr-2"
                />
                <Tooltip title="Add Contribution">
                  <IconButton
                    onClick={() => handleContribution(index)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Goal">
                  <IconButton
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Goal">
                  <IconButton
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          );
        })}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingGoal !== null ? "Edit Goal" : "Add Goal"}
        </DialogTitle>
        <DialogContent className="space-y-2">
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={newGoal.amount}
            onChange={(e) =>
              setNewGoal({ ...newGoal, amount: Number(e.target.value) })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { paddingTop: 8 } }}
          />
          <TextField
            label="Goal Description"
            fullWidth
            value={newGoal.category}
            onChange={(e) =>
              setNewGoal({ ...newGoal, category: e.target.value })
            }
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newGoal.endDate}
            onChange={(e) =>
              setNewGoal({ ...newGoal, endDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancialGoals;
