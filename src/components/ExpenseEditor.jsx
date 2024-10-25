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

function ExpenseEditor({ expense, onClose }) {
  const predefinedColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#FFD700",
    "#40E0D0",
    "#FF4500",
    "#9400D3",
    "#228B22",
    "#1E90FF",
    "#FF69B4",
    "#808080",
  ];

  const predefinedCategories = [
    "House",
    "Transport",
    "Food",
    "Entertainment",
    "Utilities",
    "Health",
    "Bills",
    "Personal",
    "Miscellaneous",
  ];

  // Keep ths for now in case we want custom categories.
  const [categories, setCategories] = useState(predefinedCategories);

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const storedBudgets =
      JSON.parse(localStorage.getItem("categoryBudgets")) || {};
    return storedBudgets;
  });

  const [categoryColors, setCategoryColors] = useState(() => {
    const storedColors =
      JSON.parse(localStorage.getItem("categoryColors")) || {};
    return storedColors;
  });

  const [expenseData, setExpenseData] = useState({
    name: "",
    value: 0,
    date: "",
    category: predefinedCategories[0],
    color: categoryColors[predefinedCategories[0]] || predefinedColors[0],
  });

  const [budgetInput, setBudgetInput] = useState(
    categoryBudgets[expenseData.category] || ""
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (expense) {
      setExpenseData(expense);
      setBudgetInput(categoryBudgets[expense.category] || "");
    }
  }, [expense, categoryBudgets]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setExpenseData((prev) => ({
      ...prev,
      category: selectedCategory,
      color: categoryColors[selectedCategory] || predefinedColors[0],
    }));
    setBudgetInput(categoryBudgets[selectedCategory] || "");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (event) => {
    setBudgetInput(event.target.value);
  };

  const saveExpenseToDB = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updatedCategoryBudgets = {
        ...categoryBudgets,
        [expenseData.category]: budgetInput,
      };
      setCategoryBudgets(updatedCategoryBudgets);
      localStorage.setItem(
        "categoryBudgets",
        JSON.stringify(updatedCategoryBudgets)
      );

      if (!categoryColors[expenseData.category]) {
        const newCategoryColors = {
          ...categoryColors,
          [expenseData.category]: expenseData.color,
        };
        setCategoryColors(newCategoryColors);
        localStorage.setItem(
          "categoryColors",
          JSON.stringify(newCategoryColors)
        );
      }

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

  const handleColorSelect = (color) => {
    if (!categoryColors[expenseData.category]) {
      setExpenseData((prev) => ({
        ...prev,
        color,
      }));
    }
  };

  const isColorUsed = (color) => {
    return Object.values(categoryColors).includes(color);
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
        <div className="flex items-center">
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

          {categoryColors[expenseData.category] && (
            <div
              className="ml-4 w-6 h-6 rounded-full border"
              style={{ backgroundColor: categoryColors[expenseData.category] }}
            ></div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Budget for {expenseData.category}:
        </label>
        <input
          type="number"
          placeholder="Enter budget"
          value={budgetInput}
          onChange={handleBudgetChange}
          className="border border-gray-300 rounded w-full p-2"
        />
      </div>

      {!categoryColors[expenseData.category] && (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Choose Category Color:
          </label>
          <div className="grid grid-cols-6 gap-2">
            {predefinedColors.map((color, index) => (
              <div
                key={index}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 cursor-pointer rounded-full border-2 ${
                  expenseData.color === color
                    ? "border-black"
                    : "border-transparent"
                } ${isColorUsed(color) ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>
      )}

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
    color: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ExpenseEditor;
