import { useMemo } from "react";

const useFinancialData = (incomes, expenses) => {
  const { months, incomeTotals, expenseTotals, netIncomeTotals } = useMemo(() => {
    const incomeTotals = [];
    const expenseTotals = [];
    const netIncomeTotals = [];
    const months = [];

    const allDates = [...incomes, ...expenses].map((item) => {
      const date = new Date(item.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear().toString();
      return `${month} ${year}`;
    });

    const uniqueMonths = [...new Set(allDates)].sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
    });

    uniqueMonths.forEach((monthYear) => {
      const [month, year] = monthYear.split(" ");

      const incomesForMonth = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.toLocaleString("default", { month: "long" }) === month &&
          incomeDate.getFullYear().toString() === year
        );
      });

      const expensesForMonth = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.toLocaleString("default", { month: "long" }) === month &&
          expenseDate.getFullYear().toString() === year
        );
      });

      const incomeTotal = incomesForMonth.reduce(
        (acc, income) => acc + Number(income.value),
        0
      );
      const expenseTotal = expensesForMonth.reduce(
        (acc, expense) => acc + Number(expense.value),
        0
      );

      const netIncomeTotal = incomeTotal - expenseTotal;

      months.push(monthYear);
      incomeTotals.push(incomeTotal);
      expenseTotals.push(expenseTotal);
      netIncomeTotals.push(netIncomeTotal);
    });

    return { months, incomeTotals, expenseTotals, netIncomeTotals };
  }, [incomes, expenses]);

  return { months, incomeTotals, expenseTotals, netIncomeTotals };
};

export default useFinancialData;
