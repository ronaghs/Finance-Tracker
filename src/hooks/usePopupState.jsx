import { useState } from "react";

const usePopupState = () => {
    const [isIncomePopupOpen, setIncomePopupOpen] = useState(false);
    const [isExpensePopupOpen, setExpensePopupOpen] = useState(false);
    const [editIncome, setEditIncome] = useState(null);
    const [editExpense, setEditExpense] = useState(null);

    const openIncomeEditor = (income = null) => {
        setEditIncome(income);
        setIncomePopupOpen(true);
    };

    const openExpenseEditor = (expense = null) => {
        setEditExpense(expense);
        setExpensePopupOpen(true);
    };

    return {
        isIncomePopupOpen,
        isExpensePopupOpen,
        openIncomeEditor,
        openExpenseEditor,
        setIncomePopupOpen,
        setExpensePopupOpen,
        editIncome,
        editExpense,
    };
};

export default usePopupState;
