import { useState, useEffect } from "react";
import { fetchBudgets, deleteBudget } from "../services/budgetService";

const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [isBudgetPopupOpen, setBudgetPopupOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchBudgets(setBudgets);
    return () => unsubscribe();
  }, []);

  const handleEditBudget = (budget) => {
    console.log(budget)
    setBudgetToEdit(budget);
    setBudgetPopupOpen(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteBudget(budgetId);
    } catch (error) {
      console.error("Error deleting budget: ", error);
    }
  };

  return {
    budgets,
    budgetToEdit,
    isBudgetPopupOpen,
    setBudgetPopupOpen,
    handleEditBudget,
    handleDeleteBudget,
  };
};

export default useBudgets;
