import { useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import IncomeEditor from "../components/IncomeEditor";
import ExpenseEditor from "../components/ExpenseEditor";
import FinancialChart from "../components/FinancialChart";
import GetMonthlyData from "../hooks/GetMonthlyData";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Dashboard() {
    const { monthlyData, loading, error } = GetMonthlyData();
    const [selectedMonth, setSelectedMonth] = useState("January");

    // Popup state
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

    const getMonthlyTotals = () => {
        const months = Object.keys(monthlyData);
        const incomeTotals = months.map(month =>
            monthlyData[month]?.income.reduce((acc, item) => acc + Number(item.value), 0) || 0
        );
        const expenseTotals = months.map(month =>
            monthlyData[month]?.expenses.reduce((acc, item) => acc + Number(item.value), 0) || 0
        );
        const netIncomeTotals = months.map((month, index) =>
            incomeTotals[index] - expenseTotals[index]
        );

        return { months, incomeTotals, expenseTotals, netIncomeTotals };
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const { months, incomeTotals, expenseTotals, netIncomeTotals } = getMonthlyTotals();
    const selectedIncome = monthlyData[selectedMonth]?.income || [];
    const selectedExpenses = monthlyData[selectedMonth]?.expenses || [];

    return (
        <div className="p-4">
            <ResponsiveAppBar />
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

            <div className="mt-4">
                <label htmlFor="month-selector" className="mr-2">Select Month:</label>
                <select
                    id="month-selector"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border p-2 rounded"
                >
                    {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>

            <FinancialChart
                months={months}
                incomeTotals={incomeTotals}
                expenseTotals={expenseTotals}
                netIncomeTotals={netIncomeTotals}
                selectedMonth={selectedMonth}
                selectedIncome={selectedIncome}
                selectedExpenses={selectedExpenses}
            />

            <div className="mt-4">
                <button onClick={() => openIncomeEditor()} className="btn">
                    Add Income
                </button>
                <button onClick={() => openExpenseEditor()} className="btn ml-4">
                    Add Expense
                </button>
            </div>

            {selectedIncome.map((income) => (
                <div key={income.id}>
                    <span>{income.name}: {income.value} {income.date}</span>
                    <button onClick={() => openIncomeEditor(income)}>Edit</button>
                </div>
            ))}
            {selectedExpenses.map((expense) => (
                <div key={expense.id}>
                    <span>{expense.name}: {expense.value} {expense.date}</span>
                    <button onClick={() => openExpenseEditor(expense)}>Edit</button>
                </div>
            ))}

            {isIncomePopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <button
                            onClick={() => setIncomePopupOpen(false)}
                            className="close-button"
                        >
                            &times;
                        </button>
                        <IncomeEditor income={editIncome} onClose={() => setIncomePopupOpen(false)} />
                    </div>
                </div>
            )}

            {isExpensePopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <button
                            onClick={() => setExpensePopupOpen(false)}
                            className="close-button"
                        >
                            &times;
                        </button>
                        <ExpenseEditor expense={editExpense} onClose={() => setExpensePopupOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
