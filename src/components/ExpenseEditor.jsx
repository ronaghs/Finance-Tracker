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

function ExpenseEditor({ expense, onClose }) {
    const predefinedCategories = expenseCategories;

  const [categories, setCategories] = useState(predefinedCategories);
  const [expenseData, setExpenseData] = useState({
    name: "",
    value: 0,
    date: "",
    category: predefinedCategories[0],
  });

  const [message, setMessage] = useState("");

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
    setExpenseData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  const saveExpenseToDB = async () => {
    const { name, value, date, category } = expenseData;

    // Check if all fields are filled
    if (!name || !value || !date || !category) {
      setMessage("Please fill out all fields before saving.");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      if (expense) {
        const expenseDoc = doc(db, "expenses", expense.id);
        await updateDoc(expenseDoc, { ...expenseData, userId });
      } else {
        await addDoc(collection(db, "expenses"), { ...expenseData, userId });
      }
      setMessage("Expense saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving expense: ", error);
      setMessage("Error saving expense.");
    }
  };

  const deleteExpense = async () => {
    try {
      if (expense) {
        const expenseDoc = doc(db, "expenses", expense.id);
        await deleteDoc(expenseDoc);
        setMessage("Expense deleted successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting expense: ", error);
      setMessage("Error deleting expense.");
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
          value={expenseData.value}
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

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

ExpenseEditor.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ExpenseEditor;

