import { useState } from "react";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

function IncomeEditor() {
    const [income, setIncome] = useState([{ name: "", value: 0, date: "" }]);
    const [message, setMessage] = useState("");

    const handleIncomeChange = (index, event) => {
        const values = [...income];
        values[index][event.target.name] = event.target.value;
        setIncome(values);
    };

    const addIncomeRow = () => setIncome([...income, { name: "", value: 0, date: "" }]);

    const removeIncomeRow = (index) => {
        const values = income.filter((_, i) => i !== index);
        setIncome(values);
    };

    const saveIncomeToDB = async () => {
        try {
            for (let inc of income) {
                await addDoc(collection(db, "incomes"), {
                    name: inc.name,
                    value: inc.value,
                    date: inc.date
                });
            }
            setMessage("Income saved successfully!");
        } catch (error) {
            console.error("Error saving income: ", error);
            setMessage("Error saving income.");
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-xl">Income</h3>
            {income.map((row, index) => (
                <div key={index} className="flex mb-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Income Source"
                        value={row.name}
                        onChange={(e) => handleIncomeChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <input
                        type="number"
                        name="value"
                        placeholder="Amount"
                        value={row.value}
                        onChange={(e) => handleIncomeChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={row.date}
                        onChange={(e) => handleIncomeChange(index, e)}
                        className="border p-1 mr-2"
                    />
                    <button
                        onClick={() => removeIncomeRow(index)}
                        className="bg-red-500 text-white p-1"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={addIncomeRow}
                className="bg-blue-500 text-white p-2 mb-4"
            >
                Add Income
            </button>
            <button
                onClick={saveIncomeToDB}
                className="bg-green-500 text-white p-2"
            >
                Save Income
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default IncomeEditor;