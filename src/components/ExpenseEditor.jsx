import { useState } from "react";
function ExpenseEditor() {
    const [expenses, setExpenses] = useState([{ name: "", value: 0 }]);

    const handleExpenseChange = (index, event) => {
        const values = [...expenses];
        values[index][event.target.name] = event.target.value;
        setExpenses(values);
    };

    const addExpenseRow = () =>
        setExpenses([...expenses, { name: "", value: 0 }]);

    const removeExpenseRow = (index) => {
        const values = expenses.filter((_, i) => i !== index);
        setExpenses(values);
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
        </div>
    );
}

export default ExpenseEditor;
