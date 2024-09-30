import { useState } from "react";

function BudgetTracker() {
  const [income, setIncome] = useState([{ name: "", value: 0 }]);
  const [expenses, setExpenses] = useState([{ name: "", value: 0 }]);

  const handleIncomeChange = (index, event) => {
    const values = [...income];
    values[index][event.target.name] = event.target.value;
    setIncome(values);
  };

  const handleExpenseChange = (index, event) => {
    const values = [...expenses];
    values[index][event.target.name] = event.target.value;
    setExpenses(values);
  };

  const addIncomeRow = () => setIncome([...income, { name: "", value: 0 }]);
  const addExpenseRow = () =>
    setExpenses([...expenses, { name: "", value: 0 }]);

  const removeIncomeRow = (index) => {
    const values = income.filter((_, i) => i !== index);
    setIncome(values);
  };

  const removeExpenseRow = (index) => {
    const values = expenses.filter((_, i) => i !== index);
    setExpenses(values);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Budget Tracker</h2>

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

export default BudgetTracker;
