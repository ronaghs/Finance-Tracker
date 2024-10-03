import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import IncomeEditor from "../components/IncomeEditor";
import ExpenseEditor from "../components/ExpenseEditor";
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

    const data = {
        labels: months,
        datasets: [
            {
                label: "Income",
                data: incomeTotals,
                borderColor: "green",
                fill: false,
            },
            {
                label: "Expenses",
                data: expenseTotals,
                borderColor: "red",
                fill: false,
            },
            {
                label: "Net Income",
                data: netIncomeTotals,
                borderColor: "blue",
                fill: false,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Financial Overview',
            },
        },
    };

    const selectedIncome = monthlyData[selectedMonth]?.income || [];
    const selectedExpenses = monthlyData[selectedMonth]?.expenses || [];

    const incomePieData = {
        labels: selectedIncome.map(item => item.name),
        datasets: [{
            data: selectedIncome.map(item => item.value),
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    const expensesPieData = {
        labels: selectedExpenses.map(item => item.name),
        datasets: [{
            data: selectedExpenses.map(item => item.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    const hasIncome = selectedIncome.length > 0;
    const hasExpenses = selectedExpenses.length > 0;

    return (
        <div className="p-4">
            <ResponsiveAppBar />
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

            <div className="line-chart mt-4">
                <Line data={data} options={options} />
            </div>

            <div className="mt-4">
                <label htmlFor="monthSelector" className="mr-2">Select Month:</label>
                <select id="monthSelector" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                    {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>

            <div className="mt-4 pie-charts">
                {hasIncome || hasExpenses ? (
                    <>
                        <div className="chart-container">
                            <h3 className="text-xl font-bold">Income Breakdown for {selectedMonth}</h3>
                            <Pie data={incomePieData} />
                        </div>

                        <div className="chart-container">
                            <h3 className="text-xl font-bold">Expenses Breakdown for {selectedMonth}</h3>
                            <Pie data={expensesPieData} />
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-lg">You have no income or expenses for {selectedMonth}. Please press the buttons below to add income or expenses.</p>
                    </div>
                )}
            </div>

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