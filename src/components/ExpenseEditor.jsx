import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { db, auth } from "../firebase/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";
import { expenseCategories } from "../constants/categories";

function ExpenseEditor({
  expense,
  onClose,
  updateAccountBalance,
  budgets,
  expenses = [],
}) {
  const [expenseData, setExpenseData] = useState({
    name: "",
    value: 0,
    date: "",
    category: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
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

  const validateExpense = () => {
    const { category, value } = expenseData;

    // Find the relevant budget
    const matchingBudget = budgets.find(
      (budget) => budget.category === category
    );

    if (matchingBudget) {
      // Calculate the total current spending within the budget's date range
      const currentSpending = expenses
        .filter((expense) => {
          return (
            expense.category === category &&
            new Date(expense.date) >= new Date(matchingBudget.startDate) &&
            new Date(expense.date) <= new Date(matchingBudget.endDate)
          );
        })
        .reduce((total, expense) => total + expense.value, 0);

      const newTotalSpending = currentSpending + value;

      if (newTotalSpending > matchingBudget.value) {
        throw new Error(
          `Budget exceeded for ${category}! Current Spending: $${currentSpending.toFixed(
            2
          )}, Attempted Spending: $${newTotalSpending.toFixed(2)}, Budget: $${
            matchingBudget.value
          }`
        );
      }
    }
  };

  const saveExpenseToDB = async () => {
    const { name, value, date, category } = expenseData;

    if (!name || !value || !date || !category) {
      showNotification("Please fill out all fields before saving.", "warning");
      return;
    }

    try {
      validateExpense(); // Validate the expense

      const userId = auth.currentUser?.uid;
      if (!userId) return;

      if (expense) {
        const expenseDoc = doc(db, "expenses", expense.id);
        await updateDoc(expenseDoc, { ...expenseData, userId });
      } else {
        await addDoc(collection(db, "expenses"), { ...expenseData, userId });
      }

      if (updateAccountBalance) {
        updateAccountBalance(-value);
      }

      showNotification("Expense saved successfully!", "success");
      onClose();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">
        {expense ? "Edit Expense" : "Add Expense"}
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          name="name"
          value={expenseData.name}
          onChange={handleChange}
          placeholder="Enter expense name"
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
          value={expenseData.value || ""}
          onChange={handleChange}
          placeholder="Enter amount"
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
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        >
          <option value="">Select Category</option>
          {expenseCategories.map((category) => (
            <option key={category} value={category}>
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
            onClick={() => {
              const expenseDoc = doc(db, "expenses", expense.id);
              deleteDoc(expenseDoc);
              onClose();
            }}
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
      >
        <Alert onClose={handleCloseSnackbar} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

ExpenseEditor.propTypes = {
  expense: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  updateAccountBalance: PropTypes.func,
  budgets: PropTypes.array.isRequired,
  expenses: PropTypes.array.isRequired, // Ensures expenses are passed correctly
};

export default ExpenseEditor;
