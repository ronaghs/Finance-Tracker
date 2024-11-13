import { useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import IncomeEditor from "../components/IncomeEditor";
import ExpenseEditor from "../components/ExpenseEditor";
import FinancialChart from "../components/FinancialChart";
import BudgetCreator from "../components/BudgetCreator";
import useIncomesAndExpenses from "../hooks/useIncomesAndExpenses";
import usePopupState from "../hooks/usePopupState";
import useFinancialData from "../hooks/useFinancialData";
import useGoals from "../hooks/useGoals";
import useBudgets from "../hooks/useBudgets";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import SavingsNotification from "../components/SavingsNotification";
import NotificationBanner from "../components/NotificationBanner";

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
  const { goals, applyIncomeToGoals, notification, setNotification } =
    useGoals();
  const {
    budgets,
    budgetToEdit,
    isBudgetPopupOpen,
    setBudgetPopupOpen,
    handleEditBudget,
    handleDeleteBudget,
  } = useBudgets();
  const [selected, setSelected] = useState("November 2024");

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

  const { incomes, expenses } = useIncomesAndExpenses(
    isIncomePopupOpen,
    isExpensePopupOpen
  );

  const calculateAccountBalance = () => {
    const totalIncome = incomes.reduce(
      (acc, income) => acc + Number(income.value),
      0
    );
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + Number(expense.value),
      0
    );
    return totalIncome - totalExpenses;
  };

  const { months, incomeTotals, expenseTotals, netIncomeTotals } =
    useFinancialData(incomes, expenses);
  const accountBalance = calculateAccountBalance();
  const [selectedMonth, selectedYear] = selected.split(" ") || ["", ""];

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

  const budgetData = budgets.map((budget) => {
    const budgetStartDate = new Date(budget.startDate);
    const budgetEndDate = new Date(budget.endDate);

    const currentExpenses =
      budget.type === "expense"
        ? expenses
            .filter(
              (expense) =>
                expense.category === budget.category &&
                new Date(expense.date) >= budgetStartDate &&
                new Date(expense.date) <= budgetEndDate
            )
            .reduce((acc, expense) => acc + Number(expense.value), 0)
        : null;

    const currentIncomes =
      budget.type === "income"
        ? incomes
            .filter(
              (income) =>
                income.category === budget.category &&
                new Date(income.date) >= budgetStartDate &&
                new Date(income.date) <= budgetEndDate
            )
            .reduce((acc, income) => acc + Number(income.value), 0)
        : null;

    return {
      id: budget.id,
      category: budget.category,
      budgetValue: budget.value,
      budgetStartDate: budget.startDate,
      budgetEndDate: budget.endDate,
      currentSpending: currentExpenses,
      currentIncome: currentIncomes,
    };
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ResponsiveAppBar />
      <NotificationBanner goals={goals} />
      <SavingsNotification
        notification={notification}
        setNotification={setNotification}
      />
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Account Balance
          </h3>
          <p
            className={`text-2xl font-bold ${
              accountBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
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

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Budgets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetData.map((budget) => (
              <div
                key={budget.id}
                className="bg-white p-6 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-xl relative"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-blue-600">
                    {budget.category}
                  </h4>
                  <div className="flex space-x-3">
                    <FaEdit
                      onClick={() => handleEditBudget(budget)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      title="Edit Budget"
                    />
                    <FaTrash
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete Budget"
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p className="mb-1">
                    <span className="font-medium">Budget:</span> $
                    {budget.budgetValue}
                  </p>
                  {budget.currentSpending !== null && (
                    <p className="mb-1">
                      <span className="font-medium">Current Spending:</span> $
                      {budget.currentSpending.toFixed(2)}
                    </p>
                  )}
                  {budget.currentIncome !== null && (
                    <p className="mb-1">
                      <span className="font-medium">Current Income:</span> $
                      {budget.currentIncome.toFixed(2)}
                    </p>
                  )}
                  <p className="mb-1">
                    <span className="font-medium">Start Date:</span>{" "}
                    {budget.budgetStartDate}
                  </p>
                  <p>
                    <span className="font-medium">End Date:</span>{" "}
                    {budget.budgetEndDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FinancialChart
          months={months}
          incomeTotals={incomeTotals}
          expenseTotals={expenseTotals}
          netIncomeTotals={netIncomeTotals}
          selectedMonth={selectedMonth}
          selectedIncome={filteredIncomes}
          selectedExpenses={filteredExpenses}
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

          {/* Income Cards */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Incomes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIncomes.map((income) => (
                <div
                  key={income.id}
                  className="bg-white p-6 shadow-lg rounded-lg relative border border-blue-100 hover:border-blue-300 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <h4 className="text-lg font-semibold text-blue-600">
                    {income.name}
                  </h4>
                  <p className="text-sm text-gray-500">{income.date}</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    ${income.value}
                  </p>
                  <button
                    onClick={() => openIncomeEditor(income)}
                    className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center"
                  >
                    <i className="fas fa-pen mr-2"></i> Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Cards */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Expenses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-6 shadow-lg rounded-lg relative border border-red-100 hover:border-red-300 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <h4 className="text-lg font-semibold text-red-600">
                    {expense.name}
                  </h4>
                  <p className="text-sm text-gray-500">{expense.date}</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    ${expense.value}
                  </p>
                  <button
                    onClick={() => openExpenseEditor(expense)}
                    className="mt-4 text-red-500 hover:text-red-700 font-medium flex items-center"
                  >
                    <i className="fas fa-pen mr-2"></i> Edit
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
                  goals={goals} // Pass goals to IncomeEditor
                  applyIncomeToGoals={applyIncomeToGoals} // Pass the function to apply income to goals
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
                  onClick={() => {
                    setBudgetPopupOpen(false);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <BudgetCreator
                  onClose={() => {
                    setBudgetPopupOpen(false);
                  }}
                  budgetToEdit={budgetToEdit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
