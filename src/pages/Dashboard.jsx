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
import { FaWallet } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    handleCreateBudget,
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
      (acc, income) => acc + Number(income.originalValue || income.value),
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
      type: budget.type,
      category: budget.category,
      value: budget.value,
      startDate: budget.startDate,
      endDate: budget.endDate,
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
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-6 border-b-4 border-blue-500 pb-2">
          Dashboard
        </h2>

        {/* Button section */}
        <div className="flex justify-between items-center bg-gradient-to-r from-green-100 via-white to-blue-100 shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          {/* Account Balance Section */}
          <div className="flex items-center space-x-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-md"
              style={{
                background: "linear-gradient(to left, #3b82f6, #6b21a8)", // Gradient
              }}
            >
              <FaWallet className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Account Balance:
              </p>
              <p className="text-4xl font-extrabold text-green-700">
                ${accountBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex space-x-4">
            <button
              onClick={() => openIncomeEditor()}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-plus-circle mr-2"></i> Add Income
            </button>
            <button
              onClick={() => openExpenseEditor()}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-minus-circle mr-2"></i> Add Expense
            </button>
            <button
              onClick={() => handleCreateBudget()}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-wallet mr-2"></i> Create Budget
            </button>
          </div>
        </div>

        {/* Month Selector */}
        {months.length > 0 && (
          <div className="flex flex-col md:flex-row items-center mb-6">
            <label
              htmlFor="month-selector"
              className="mb-2 md:mb-0 mr-4 text-2xl font-semibold text-gray-800"
            >
              Select Month:
            </label>
            {months.length === 1 ? (
              // Automatically set the selected month if only one is available
              <span className="text-lg font-medium">{months[0]}</span>
            ) : (
              <select
                id="month-selector"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 text-lg w-full md:w-auto bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                {months.map((month) => (
                  <option key={month} value={month} className="text-lg">
                    {month}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Financial Chart */}
        <FinancialChart
          months={months}
          incomeTotals={incomeTotals}
          expenseTotals={expenseTotals}
          netIncomeTotals={netIncomeTotals}
          selectedMonth={selectedMonth}
          selectedIncome={filteredIncomes}
          selectedExpenses={filteredExpenses}
        />

        {/* Incomes Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3 className="text-2xl font-semibold text-gray-800">Incomes</h3>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => openIncomeEditor()}
                className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center transition duration-200 transform hover:scale-105"
              >
                <i className="fas fa-plus mr-3"></i> Add Income
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIncomes.map((income) => (
                <div
                  key={income.id}
                  className="bg-white p-6 shadow-lg rounded-lg relative border border-green-100 hover:border-green-300 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <h4 className="text-lg font-semibold text-green-600">
                    {income.name}
                  </h4>
                  <p className="text-sm text-gray-500">{income.date}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    ${income.value.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Saved to goals: $
                    {(income.originalValue
                      ? income.originalValue - income.value
                      : 0
                    ).toFixed(2)}
                  </p>
                  <button
                    onClick={() => openIncomeEditor(income)}
                    className="mt-4 text-green-500 hover:text-green-700 font-medium flex items-center"
                  >
                    <i className="fas fa-pen mr-2"></i> Edit
                  </button>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Expenses Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3 className="text-2xl font-semibold text-gray-800">Expenses</h3>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => openExpenseEditor()}
                className="bg-red-500 hover:bg-red-700 text-white py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center transition duration-200 transform hover:scale-105"
              >
                <i className="fas fa-plus mr-3"></i> Add Expense
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-6 shadow-lg rounded-lg relative border border-red-100 hover:border-red-300 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <h4 className="text-lg font-semibold text-red-600">
                    {expense.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {expense.date.split("T")[0]}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    ${expense.value.toFixed(2)}
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
          </AccordionDetails>
        </Accordion>

        {/* Budgets Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3 className="text-2xl font-semibold text-gray-800">Budgets</h3>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => handleCreateBudget()}
                className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center transition duration-200 transform hover:scale-105"
              >
                <i className="fas fa-plus mr-3"></i> Create Budget
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetData.map((budget) => (
                <div
                  key={budget.id}
                  className="bg-white p-6 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-xl relative"
                >
                  <div className="flex justify-between items-center mb-4">
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
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">
                      <span className="font-medium">Budget:</span> $
                      {budget.value}
                    </p>
                    {budget.currentSpending !== null && (
                      <p className="mb-1">
                        <span className="font-medium">Current Spending:</span> $
                        {budget.currentSpending.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Popup Modals for Editing */}
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
                goals={goals}
                applyIncomeToGoals={applyIncomeToGoals}
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
                expenses={expenses}
                budgets={budgets}
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
  );
}

export default Dashboard;
