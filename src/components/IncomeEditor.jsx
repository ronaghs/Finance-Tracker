import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

function IncomeEditor({ income, onClose }) {
    const [incomeData, setIncomeData] = useState({ name: "", value: 0, date: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (income) {
            setIncomeData(income);
        }
    }, [income]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setIncomeData((prev) => ({ ...prev, [name]: value }));
    };

    const saveIncomeToDB = async () => {
        try {
            if (income) {
                const incomeDoc = doc(db, "incomes", income.id);
                await updateDoc(incomeDoc, incomeData);
            } else {
                await addDoc(collection(db, "incomes"), {
                    name: incomeData.name,
                    value: Number(incomeData.value),
                    date: incomeData.date
                });
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
        <div className="p-4">
            <h3 className="text-xl">{income ? "Edit Income" : "Add Income"}</h3>
            <input
                type="text"
                name="name"
                placeholder="Income Source"
                value={incomeData.name}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <input
                type="number"
                name="value"
                placeholder="Amount"
                value={incomeData.value}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <input
                type="date"
                name="date"
                value={incomeData.date}
                onChange={handleChange}
                className="border p-1 mr-2"
            />
            <button onClick={saveIncomeToDB} className="bg-green-500 text-white p-2">
                Save
            </button>
            {income && (
                <button onClick={deleteIncome} className="bg-red-500 text-white p-2 ml-2">
                    Delete
                </button>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default IncomeEditor;