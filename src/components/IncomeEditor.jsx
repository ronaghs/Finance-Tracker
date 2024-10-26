import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { incomeCategories } from "../constants/categories";
import { db, auth } from "../firebase/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function IncomeEditor({ income, onClose }) {
  const predefinedCategories = incomeCategories;

  const [categories, setCategories] = useState(predefinedCategories);
  const [incomeData, setIncomeData] = useState({
    name: "",
    value: 0,
    date: "",
    category: predefinedCategories[0],
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (income) {
      setIncomeData(income);
    }
  }, [income]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setIncomeData((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIncomeData((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };


  const saveIncomeToDB = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      if (income) {
        const incomeDoc = doc(db, "incomes", income.id);
        await updateDoc(incomeDoc, { ...incomeData, userId });
      } else {
        await addDoc(collection(db, "incomes"), { ...incomeData, userId });
      }
      setMessage("Income saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving income: ", error);
      setMessage("Error saving income.");
    }
  };

  const deleteIncome = async () => {
    try {
      if (income) {
        const incomeDoc = doc(db, "incomes", income.id);
        await deleteDoc(incomeDoc);
        setMessage("Income deleted successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting income: ", error);
      setMessage("Error deleting income.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">
        {income ? "Edit Income" : "Add Income"}
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Income Source:
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter income source"
          value={incomeData.name}
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
          value={incomeData.value}
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
          value={incomeData.date}
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
          value={incomeData.category}
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
          onClick={saveIncomeToDB}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Save
        </button>
        {income && (
          <button
            onClick={deleteIncome}
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

IncomeEditor.propTypes = {
  income: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default IncomeEditor;
