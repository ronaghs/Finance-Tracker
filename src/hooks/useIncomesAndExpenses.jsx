import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseconfig";

const useIncomesAndExpenses = (isIncomePopupOpen, isExpensePopupOpen) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchIncomesAndExpenses = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Fetch incomes
        const incomeQuery = query(
          collection(db, "incomes"),
          where("userId", "==", userId)
        );
        const incomeSnapshot = await getDocs(incomeQuery);
        const fetchedIncomes = incomeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch expenses
        const expenseQuery = query(
          collection(db, "expenses"),
          where("userId", "==", userId)
        );
        const expenseSnapshot = await getDocs(expenseQuery);
        const fetchedExpenses = expenseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIncomes(fetchedIncomes);
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching incomes and expenses: ", error);
      }
    };

    fetchIncomesAndExpenses();
  }, [isIncomePopupOpen, isExpensePopupOpen]);

  return { incomes, expenses };
};

export default useIncomesAndExpenses;