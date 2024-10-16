import { useState } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

function ExpenseEditor() {
    const [expenses, setExpenses] = useState([{ name: "", value: 0, date: "" }]);
    const [message, setMessage] = useState("");

    const handleExpenseChange = (index, event) => {
        const values = [...expenses];
        values[index][event.target.name] = event.target.value;
        setExpenses(values);
    };

    const addExpenseRow = () => setExpenses([...expenses, { name: "", value: 0, date: "" }]);

    const removeExpenseRow = (index) => {
        const values = expenses.filter((_, i) => i !== index);
        setExpenses(values);
    };

    const saveExpensesToDB = async () => {
        try {
            for (let expense of expenses) {
                await addDoc(collection(db, "expenses"), {
                    name: expense.name,
                    value: Number(expense.value),
                    date: expense.date
                });
            }
            setMessage("Expenses saved successfully!");
        } catch (error) {
            console.error("Error saving expenses: ", error);
            setMessage("Error saving expenses.");
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-xl">Expenses</h3>
            {expenses.map((row, index) => (
                <div key={index} className="flex mb-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Expense Name"
                        value={row.name}
                        onChange={(e) => handleExpenseChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <input
                        type="number"
                        name="value"
                        placeholder="Amount"
                        value={row.value}
                        onChange={(e) => handleExpenseChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={row.date}
                        onChange={(e) => handleExpenseChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <button
                        onClick={() => removeExpenseRow(index)}
                        className="bg-red-500 text-white p-1"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={addExpenseRow}
                className="bg-blue-500 text-white p-2 mb-4"
            >
                Add Expense
            </button>
            <button
                onClick={saveExpensesToDB}
                className="bg-green-500 text-white p-2"
            >
                Save Expenses
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ExpenseEditor;
