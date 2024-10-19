import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, LineElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement } from "chart.js";
ChartJS.register(LineElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement);

const LineChart = ({ months, incomeTotals, expenseTotals, netIncomeTotals }) => {
    const data = {
        labels: months,
        datasets: [
            {
                label: "Income",
                data: incomeTotals,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "green",
                fill: false,
            },
            {
                label: "Expenses",
                data: expenseTotals,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "red",
                fill: false,
            },
            {
                label: "Net Income",
                data: netIncomeTotals,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "blue",
                fill: false,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                    },
                    color: "#333",
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                bodyFont: {
                    size: 14,
                },
                padding: 10,
            },
            title: {
                display: true,
                text: 'Monthly Financial Overview',
                font: {
                    size: 18,
                },
                color: '#333',
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months',
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                    font: {
                        size: 14,
                    },
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1000,
                },
            },
        },
        elements: {
            line: {
                tension: 0, // Ensures lines remain straight
            },
        },
    };

    return (
        <div className="line-chart-container p-6 bg-white rounded-lg shadow-lg mt-4">
            <Line data={data} options={options} />
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
