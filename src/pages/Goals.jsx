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
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    amount: "",
    category: "",
    endDate: "",
    saved: 0,
    contribution: 0,
    contributionPercentage: 0, 
  });
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const goalsQuery = query(
      collection(db, "goals"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(goalsQuery, (querySnapshot) => {
      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(fetchedGoals);
    });

    return () => unsubscribe();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewGoal({
      amount: "",
      category: "",
      endDate: "",
      saved: 0,
      contribution: 0,
      contributionPercentage: 0,
    });
    setEditingGoal(null);
    setDateError(false);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (selectedDate < today) {
      setDateError(true);
    } else {
      setDateError(false);
      setNewGoal({ ...newGoal, endDate: e.target.value });
    }
  };

  const handleSave = async () => {
    if (dateError) {
      alert("Please pick a valid date!");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) return;

    if (editingGoal !== null) {
      const goalDocRef = doc(db, "goals", editingGoal);
      await updateDoc(goalDocRef, { ...newGoal, userId });
      const updatedGoals = goals.map((goal) =>
        goal.id === editingGoal ? { id: editingGoal, ...newGoal, userId } : goal
      );
      setGoals(updatedGoals);
    } else {
      const docRef = await addDoc(collection(db, "goals"), {
        ...newGoal,
        userId,
      });
      setGoals([...goals, { id: docRef.id, ...newGoal, userId }]);
    }
    handleClose();
  };

  const handleEdit = (index) => {
    setEditingGoal(goals[index].id);
    setNewGoal(goals[index]);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    const goal = goals[index];
    const confirmDelete = window.confirm(`Delete this goal?`);
    if (confirmDelete) {
      const goalId = goal.id;
      await deleteDoc(doc(db, "goals", goalId));
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const handleContributionChange = (index, amount) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, contribution: amount } : goal
    );
    setGoals(updatedGoals);
  };

  const handleContribution = async (index) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const goal = goals[index];
    const newSaved = goal.saved + goal.contribution;
    if (newSaved >= goal.amount) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    const updatedGoal = { ...goal, saved: newSaved, contribution: 0 };
    await updateDoc(doc(db, "goals", goal.id), updatedGoal);
    const updatedGoals = goals.map((g, i) => (i === index ? updatedGoal : g));
    setGoals(updatedGoals);
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const goalDate = new Date(endDate);
    const timeDifference = goalDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 75) return "#4caf50";
    if (progress >= 30) return "#ffeb3b";
    return "#f44336";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          const cappedProgress = Math.min(progress, 100);
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
                    💰 Saved:{" "}
                    <span className="text-green-600 ml-1">${goal.saved}</span>
                  </Typography>
                </div>
                <Tooltip title={`Goal Date: ${formatDate(goal.endDate)}`}>
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
                </Tooltip>
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
                    inputProps: { min: 0 },
                  }}
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
            value={newGoal.amount === 0 ? "" : newGoal.amount}
            onChange={(e) =>
              setNewGoal({
                ...newGoal,
                amount: e.target.value === "" ? 0 : Number(e.target.value),
              })
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
            label="Contribution Percentage"
            type="number"
            fullWidth
            value={newGoal.contributionPercentage}
            onChange={(e) =>
              setNewGoal({
                ...newGoal,
                contributionPercentage: Number(e.target.value),
              })
            }
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newGoal.endDate}
            onChange={handleDateChange}
            error={dateError}
            helperText={dateError ? "Pick a valid date" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={dateError}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancialGoals;
