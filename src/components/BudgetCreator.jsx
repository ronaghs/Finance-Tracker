import { useState } from "react";
import PropTypes from "prop-types";
import { db, auth } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import { incomeCategories, expenseCategories } from "../constants/categories";

function BudgetCreator({ onClose }) {
  const [budgetData, setBudgetData] = useState({
    type: "income", // Default to "income"
    category: "",
    startDate: "",
    endDate: "",
    value: 0,
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBudgetData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  const saveBudgetToDB = async () => {
    const { type, category, startDate, endDate, value } = budgetData;

    // Check if all fields are filled
    if (!type || !category || !startDate || !endDate || !value) {
        setMessage("Please fill in all fields before saving the budget.");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(db, "budgets"), {
        ...budgetData,
        userId,
      });
      setMessage("Budget saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving budget: ", error);
      setMessage("Error saving budget.");
    }
  };

  // Get categories based on the selected type
  const categories = budgetData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="p-4">
      <h3 className="text-xl">{budgetData.type === "income" ? "Income Budget" : "Expense Budget"}</h3>

      {/* Select Type */}
      <label className="block mt-2">Type:</label>
      <select
        name="type"
        value={budgetData.type}
        onChange={handleChange}
        className="border p-1"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      
      {/* Select Category */}
      <label className="block mt-2">Category:</label>
      <select
        name="category"
        value={budgetData.category}
        onChange={handleChange}
        className="border p-1"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Date Range */}
      <label className="block mt-2">Start Date:</label>
      <input
        type="date"
        name="startDate"
        value={budgetData.startDate}
        onChange={handleChange}
        className="border p-1"
      />

      <label className="block mt-2">End Date:</label>
      <input
        type="date"
        name="endDate"
        value={budgetData.endDate}
        onChange={handleChange}
        className="border p-1"
      />

      {/* Budget Value */}
      <label className="block mt-2">Budget Value:</label>
      <input
        type="number"
        name="value"
        placeholder="Amount"
        value={budgetData.value}
        onChange={handleChange}
        className="border p-1"
      />

      {/* Save Button */}
      <button onClick={saveBudgetToDB} className="bg-green-500 text-white p-2 mt-4">
        Save Budget
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

BudgetCreator.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BudgetCreator;
