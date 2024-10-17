import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

function ExpenseEditor({ expense, onClose }) {
    const [expenseData, setExpenseData] = useState({ name: "", value: 0, date: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (expense) {
            setExpenseData(expense);
        }
    }, [expense]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setExpenseData((prev) => ({ ...prev, [name]: value }));
    };

    const saveExpenseToDB = async () => {
        try {
            if (expense) {
                const expenseDoc = doc(db, "expenses", expense.id);
                await updateDoc(expenseDoc, expenseData);
            } else {
                await addDoc(collection(db, "expenses"), {
                    name: expenseData.name,
                    value: Number(expenseData.value),
                    date: expenseData.date
                });
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
        <div className="p-4">
            <h3 className="text-xl">{expense ? "Edit Expense" : "Add Expense"}</h3>
            <input
                type="text"
                name="name"
                placeholder="Expense Source"
                value={expenseData.name}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <input
                type="number"
                name="value"
                placeholder="Amount"
                value={expenseData.value}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <input
                type="date"
                name="date"
                value={expenseData.date}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <button onClick={saveExpenseToDB} className="bg-green-500 text-white p-2">
                Save
            </button>
            {expense && (
                <button onClick={deleteExpense} className="bg-red-500 text-white p-2 ml-2">
                    Delete
                </button>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default ExpenseEditor;

