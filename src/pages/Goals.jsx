import { useState, useEffect } from "react";
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
import { db, auth } from "../firebase/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import auth state listener

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]); // Stores all the user-specific goals
  const [newGoal, setNewGoal] = useState({
    amount: "",
    category: "",
    endDate: "",
    saved: 0,
    contribution: 0,
  });
  const [open, setOpen] = useState(false); // Controls the goal dialog
  const [editingGoal, setEditingGoal] = useState(null); // Track if a goal is being edited
  const [showConfetti, setShowConfetti] = useState(false); // Trigger confetti when a goal is reached

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch goals from Firestore for the logged-in user
        const fetchGoals = async () => {
          try {
            const q = query(
              collection(db, "goals"),
              where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const fetchedGoals = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setGoals(fetchedGoals); // Set fetched goals to the state
          } catch (error) {
            console.error("Error fetching goals:", error);
          }
        };
        fetchGoals();
      } else {
        console.error("No authenticated user found.");
        setGoals([]); // Clear goals if no user is found
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Open the Add/Edit Goal dialog
  const handleOpen = () => setOpen(true);

  // Close the prompt and reset the newGoal state
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

  // Save or update a goal in Firestore
  const handleSave = async () => {
    const userId = auth.currentUser?.uid; // Get the current user's ID
    if (!userId) return; // Exit if user is not logged in

    if (editingGoal !== null) {
      // Update an existing goal
      const goalDocRef = doc(db, "goals", editingGoal);
      await updateDoc(goalDocRef, { ...newGoal, userId });

      // Update the state to reflect the edited goal
      const updatedGoals = goals.map((goal) =>
        goal.id === editingGoal ? { id: editingGoal, ...newGoal, userId } : goal
      );
      setGoals(updatedGoals); // Update the state with the edited goal
    } else {
      // Add a new goal to Firestore
      const docRef = await addDoc(collection(db, "goals"), {
        ...newGoal,
        userId,
      });

      // Add the new goal to the state
      setGoals([...goals, { id: docRef.id, ...newGoal, userId }]); // Append new goal to the existing state
    }

    handleClose(); // Close the prompt
  };

  // Edit goal handler
  const handleEdit = (index) => {
    setEditingGoal(goals[index].id); // Track the goal being edited
    setNewGoal(goals[index]); // Pre-fill the form with the selected goal data
    setOpen(true); // Open the prompt
  };

  // Delete goal handler (removes the goal from Firestore and state)
  const handleDelete = async (index) => {
    const goalId = goals[index].id; // Get the goal ID
    await deleteDoc(doc(db, "goals", goalId)); // Delete the goal in Firestore
    setGoals(goals.filter((_, i) => i !== index)); // Remove the goal from state
  };

  // Handle the input change for contribution amount
  const handleContributionChange = (index, amount) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, contribution: amount } : goal
    );
    setGoals(updatedGoals); // Update contribution in the state
  };

  // Add the contribution to the saved amount and check if the goal is met
  const handleContribution = async (index) => {
    const userId = auth.currentUser?.uid; // Get the current user's ID
    if (!userId) return;

    const goal = goals[index]; // Get the goal being updated
    const newSaved = goal.saved + goal.contribution; // Calculate new saved value

    // If the goal is met, show confetti and celebrate
    if (newSaved >= goal.amount) {
      setShowConfetti(true); // Show confetti
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
      // alert("🎉 Congratulations! You've reached your goal! 🎉");
    }

    // Update the goal's saved amount and reset the contribution
    const updatedGoal = { ...goal, saved: newSaved, contribution: 0 };
    await updateDoc(doc(db, "goals", goal.id), updatedGoal); // Update Firestore

    // Update the goal in state
    const updatedGoals = goals.map((g, i) => (i === index ? updatedGoal : g));
    setGoals(updatedGoals);
  };

  // Calculate the remaining days until the goal's end date
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const goalDate = new Date(endDate);
    const timeDifference = goalDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
    return daysRemaining >= 0 ? daysRemaining : 0; // Return 0 if past due date
  };

  // Dynamically set the progress bar color based on progress percentage
  const getProgressBarColor = (progress) => {
    if (progress >= 75) return "#4caf50"; // Green for 75%+
    if (progress >= 30) return "#ffeb3b"; // Yellow for 30%-75%
    return "#f44336"; // Red for below 30%
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
                    🐖 Saved:{" "}
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
