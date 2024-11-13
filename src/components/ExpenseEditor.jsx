import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { expenseCategories } from "../constants/categories";
import { db, auth } from "../firebase/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";

function ExpenseEditor({ expense, onClose, updateAccountBalance, budgets }) {
  const predefinedCategories = expenseCategories;

  const [categories, setCategories] = useState(predefinedCategories);
  const [expenseData, setExpenseData] = useState({
    name: "",
    value: 0,
    date: "",
    category: predefinedCategories[0],
  });

  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (expense) {
      setExpenseData(expense);
    }
  }, [expense]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setExpenseData((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "value" && value < 0) {
      return; // Prevent negative values
    }
    setExpenseData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ message, severity });
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const saveExpenseToDB = async () => {
    const { name, value, date, category } = expenseData;

    // Check if all fields are filled
    if (!name || !value || !date || !category) {
      showNotification("Please fill out all fields before saving.", "warning");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Fetch the relevant budget
      const categoryBudget = budgets?.find(
        (budget) => budget.category === category
      );

      if (categoryBudget) {
        const currentSpending = categoryBudget.currentSpending || 0;
        const remainingBudget = categoryBudget.value - currentSpending;

        // Check if the expense exceeds the remaining budget
        if (value > remainingBudget) {
          showNotification(
            `This expense exceeds the budget for ${category}. Remaining budget: $${remainingBudget.toFixed(
              2
            )}`,
            "error"
          );
          return; // Prevent saving the expense
        }
      }

      if (expense) {
        const expenseDoc = doc(db, "expenses", expense.id);
        await updateDoc(expenseDoc, { ...expenseData, userId });
      } else {
        await addDoc(collection(db, "expenses"), { ...expenseData, userId });
      }

      // Update account balance
      if (updateAccountBalance) {
        updateAccountBalance(-value); // Deduct the expense value from the balance
      }

      showNotification("Expense saved successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error saving expense: ", error);
      showNotification("Error saving expense.", "error");
    }
  };

  const deleteExpense = async () => {
    try {
      if (expense) {
        const expenseDoc = doc(db, "expenses", expense.id);
        await deleteDoc(expenseDoc);
        showNotification("Expense deleted successfully!", "success");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting expense: ", error);
      showNotification("Error deleting expense.", "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">
        {expense ? "Edit Expense" : "Add Expense"}
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Expense Source:
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter expense source"
          value={expenseData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount:
        </label>
        <input
          type="number"
          name="value"
          placeholder="Enter amount"
          value={expenseData.value === 0 ? "" : expenseData.value}
          onFocus={(e) =>
            e.target.value === "0" &&
            setExpenseData({ ...expenseData, value: "" })
          }
          onBlur={(e) =>
            !e.target.value && setExpenseData({ ...expenseData, value: 0 })
          }
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date:
        </label>
        <input
          type="date"
          name="date"
          value={expenseData.date}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category:
        </label>
        <select
          name="category"
          value={expenseData.category}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded p-2 w-full"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between">
        <button
          onClick={saveExpenseToDB}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Save
        </button>
        {expense && (
          <button
            onClick={deleteExpense}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>

      <Snackbar
        open={showSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor:
              notification.severity === "error" ? "#f44336" : "#4caf50",
            color: "#fff",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notification.severity}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "16px",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

ExpenseEditor.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.number,
    date: PropTypes.string,
    category: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  updateAccountBalance: PropTypes.func,
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      currentSpending: PropTypes.number,
    })
  ),
};

export default ExpenseEditor;
