// LineChart.js
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

const LineChart = ({ months, incomeTotals, expenseTotals, netIncomeTotals }) => {
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

    return (
        <div className="line-chart mt-4">
            <Line
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Monthly Financial Overview' },
                    },
                }}
            />
        </div>
    );
};

// PropTypes for LineChart
LineChart.propTypes = {
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    incomeTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
    expenseTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
    netIncomeTotals: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default LineChart;
