import { useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import IncomeEditor from "../components/IncomeEditor";
import ExpenseEditor from "../components/ExpenseEditor";
import FinancialChart from "../components/FinancialChart";
import BudgetCreator from "../components/BudgetCreator";
import useIncomesAndExpenses from "../hooks/useIncomesAndExpenses";
import usePopupState from "../hooks/usePopupState";
import useFinancialData from "../hooks/useFinancialData";
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
} from "chart.js";

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
  const [selected, setSelected] = useState("October 2024");

  const [isBudgetPopupOpen, setBudgetPopupOpen] = useState(false);

  const {
    isIncomePopupOpen,
    isExpensePopupOpen,
    openIncomeEditor,
    openExpenseEditor,
    setIncomePopupOpen,
    setExpensePopupOpen,
    editIncome,
    editExpense,
  } = usePopupState();

  const { incomes, expenses } = useIncomesAndExpenses(isIncomePopupOpen, isExpensePopupOpen);

  // Use the custom hook for memoized financial data
  const { months, incomeTotals, expenseTotals, netIncomeTotals } = useFinancialData(incomes, expenses);

  // Calculate account balance
  const calculateAccountBalance = () => {
    const totalIncome = incomes.reduce((acc, income) => acc + Number(income.value), 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.value), 0);
    return totalIncome - totalExpenses;
  };

  const [selectedMonth, selectedYear] = selected.split(" ") || ["", ""]; // Ensure correct fallback

  // **Filter incomes and expenses based on selected month and year**
  const filteredIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    const incomeMonth = incomeDate.toLocaleString("default", { month: "long" });
    const incomeYear = incomeDate.getFullYear().toString();
    return incomeMonth === selectedMonth && incomeYear === selectedYear;
  });

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.toLocaleString("default", {
      month: "long",
    });
    const expenseYear = expenseDate.getFullYear().toString();
    return expenseMonth === selectedMonth && expenseYear === selectedYear;
  });

  // Account balance
  const accountBalance = calculateAccountBalance();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ResponsiveAppBar />

      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

        {/* Display account balance */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Account Balance</h3>
            <p className={`text-2xl font-bold ${accountBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${accountBalance.toFixed(2)}
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-6">
          <label
            htmlFor="month-selector"
            className="mb-2 md:mb-0 mr-4 text-lg font-medium text-gray-700"
          >
            Select Month:
          </label>
          <select
            id="month-selector"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-lg w-full md:w-auto"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <FinancialChart
          months={months}
          incomeTotals={incomeTotals}
          expenseTotals={expenseTotals}
          netIncomeTotals={netIncomeTotals}
          selectedMonth={selectedMonth}
          selectedIncome={filteredIncomes} // Use filtered incomes
          selectedExpenses={filteredExpenses} // Use filtered expenses
        />

        <div className="container mx-auto mt-8">
          <div className="flex justify-between flex-col md:flex-row mb-6 gap-4">
            <button
              onClick={() => openIncomeEditor()}
              className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Income
            </button>
            <button
              onClick={() => openExpenseEditor()}
              className="btn btn-danger bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Expense
            </button>

            <button
              onClick={() => setBudgetPopupOpen(true)}
              className="btn btn-warning bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg shadow-lg flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i> Create Budget
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Incomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIncomes.map((income) => (
                <div key={income.id} className="bg-white p-4 shadow rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-600">
                    {income.name}
                  </h4>
                  <p className="text-sm text-gray-600">{income.date}</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${income.value}
                  </p>
                  <button
                    onClick={() => openIncomeEditor(income)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Expenses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-4 shadow rounded-lg"
                >
                  <h4 className="text-lg font-semibold text-red-600">
                    {expense.name}
                  </h4>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <p className="text-lg font-bold text-gray-800">
                    ${expense.value}
                  </p>
                  <button
                    onClick={() => openExpenseEditor(expense)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {isIncomePopupOpen && (
            <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="popup-content bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                <button
                  onClick={() => setIncomePopupOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <IncomeEditor
                  income={editIncome}
                  onClose={() => setIncomePopupOpen(false)}
                />
              </div>
            </div>
          )}

          {isExpensePopupOpen && (
            <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="popup-content bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                <button
                  onClick={() => setExpensePopupOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <ExpenseEditor
                  expense={editExpense}
                  onClose={() => setExpensePopupOpen(false)}
                />
              </div>
            </div>
          )}
          {isBudgetPopupOpen && (
            <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="popup-content bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
                <button
                  onClick={() => setBudgetPopupOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <BudgetCreator onClose={() => setBudgetPopupOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
