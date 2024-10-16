import { useState, useEffect } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import IncomeEditor from "../components/IncomeEditor";
import ExpenseEditor from "../components/ExpenseEditor";
import FinancialChart from "../components/FinancialChart";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Add this for Pie charts
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
    ArcElement // Register for Pie charts
);

function Dashboard() {
    const [monthlyData, setMonthlyData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState("January");

    // Popup state
    const [isIncomePopupOpen, setIncomePopupOpen] = useState(false);
    const [isExpensePopupOpen, setExpensePopupOpen] = useState(false);

    // Change this when database is implemented
    useEffect(() => {
        const fetchData = () => {
            const defaultMonthlyData = {
                January: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                February: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                March: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                April: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                May: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                June: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                July: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                August: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                September: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                October: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                November: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                December: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] }
            };

            setMonthlyData(defaultMonthlyData);
        };

        fetchData();
    }, []);
    //-----------------------------------------

    const getMonthlyTotals = () => {
        const months = Object.keys(monthlyData);
        const incomeTotals = months.map(month =>
            monthlyData[month]?.income.reduce((acc, item) => acc + item.value, 0) || 0
        );
        const expenseTotals = months.map(month =>
            monthlyData[month]?.expenses.reduce((acc, item) => acc + item.value, 0) || 0
        );
        const netIncomeTotals = months.map((month, index) =>
            incomeTotals[index] - expenseTotals[index]
        );

        return { months, incomeTotals, expenseTotals, netIncomeTotals };
    };

    const { months, incomeTotals, expenseTotals, netIncomeTotals } = getMonthlyTotals();
    const selectedIncome = monthlyData[selectedMonth]?.income || [];
    const selectedExpenses = monthlyData[selectedMonth]?.expenses || [];

    return (
        <div className="p-4">
            <ResponsiveAppBar />
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

            {/* Month Selector */}
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

            {/* Use the FinancialChart component */}
            <FinancialChart
                months={months}
                incomeTotals={incomeTotals}
                expenseTotals={expenseTotals}
                netIncomeTotals={netIncomeTotals}
                selectedMonth={selectedMonth}
                selectedIncome={selectedIncome}
                selectedExpenses={selectedExpenses}
            />

            <div>
                {/* Buttons to open popups */}
                <div className="mt-4">
                    <button onClick={() => setIncomePopupOpen(true)} className="btn">
                        Add Income
                    </button>
                    <button onClick={() => setExpensePopupOpen(true)} className="btn ml-4">
                        Add Expense
                    </button>
                </div>

                {/* Income Editor Popup */}
                {isIncomePopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <button
                                onClick={() => setIncomePopupOpen(false)}
                                className="close-button"
                            >
                                &times; {/* This represents the "X" */}
                            </button>
                            <IncomeEditor onClose={() => setIncomePopupOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Expense Editor Popup */}
                {isExpensePopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <button
                                onClick={() => setExpensePopupOpen(false)}
                                className="close-button"
                            >
                                &times; {/* This represents the "X" */}
                            </button>
                            <ExpenseEditor onClose={() => setExpensePopupOpen(false)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;