import PropTypes from "prop-types";
import LineChart from "./LineChart"; // Import LineChart
import PieChart from "./PieChart"; // Import PieChart

// File holds the different charts on the dashboard
const FinancialChart = ({
    months,
    incomeTotals,
    expenseTotals,
    netIncomeTotals,
    selectedMonth,
    selectedIncome,
    selectedExpenses,
}) => {
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

    // Function to check if all values in an array are zero
    const allValuesAreZero = (totals) => {
        return totals.every(value => value === 0);
    };

    const hasNoIncome = allValuesAreZero(incomeTotals);
    const hasNoExpenses = allValuesAreZero(expenseTotals);

    // Limit the arrays to the last 12 months if necessary
    const recentMonths = months.length > 12 ? months.slice(-12) : months;
    const recentIncomeTotals = incomeTotals.length > 12 ? incomeTotals.slice(-12) : incomeTotals;
    const recentExpenseTotals = expenseTotals.length > 12 ? expenseTotals.slice(-12) : expenseTotals;
    const recentNetIncomeTotals = netIncomeTotals.length > 12 ? netIncomeTotals.slice(-12) : netIncomeTotals;

    return (
        <div>
            {hasNoIncome && hasNoExpenses ? (
                <div className="text-center">
                    <p className="text-lg">You have no income or expenses to display. Please press the buttons below to add income or expenses.</p>
                </div>
            ) : (
                <>
                    <LineChart
                        months={recentMonths}
                        incomeTotals={recentIncomeTotals}
                        expenseTotals={recentExpenseTotals}
                        netIncomeTotals={recentNetIncomeTotals}
                    />

                    <div className="mt-4 pie-charts">
                        {selectedIncome.length > 0 || selectedExpenses.length > 0 ? (
                            <>
                                <PieChart data={incomePieData} title={`Income Breakdown for ${selectedMonth}`} />
                                <PieChart data={expensesPieData} title={`Expenses Breakdown for ${selectedMonth}`} />
                            </>
                        ) : (
                            <div className="text-center">
                                <p className="text-lg">You have no income or expenses for {selectedMonth}. Please press the buttons below to add income or expenses.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// PropTypes for FinancialChart
FinancialChart.propTypes = {
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    incomeTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
    expenseTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
    netIncomeTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedMonth: PropTypes.string.isRequired,
    selectedIncome: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })).isRequired,
    selectedExpenses: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })).isRequired,
};

export default FinancialChart;
