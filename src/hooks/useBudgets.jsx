import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { doc, deleteDoc, onSnapshot, collection } from "firebase/firestore";

const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [isBudgetPopupOpen, setBudgetPopupOpen] = useState(false);

  // Fetch budgets from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "budgets"),
      (snapshot) => {
        const updatedBudgets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBudgets(updatedBudgets);
      },
      (error) => console.error("Error fetching budgets: ", error)
    );

    return () => unsubscribe();
  }, []);

  // Handle editing a budget
  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setBudgetPopupOpen(true);
  };

  // Handle deleting a budget
  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteDoc(doc(db, "budgets", budgetId));
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