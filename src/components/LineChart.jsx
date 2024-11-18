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
                borderWidth: 4,
                pointRadius: 7,
                pointHoverRadius: 10,
                pointBackgroundColor: "green",
                fill: false,
            },
            {
                label: "Expenses",
                data: expenseTotals,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderWidth: 4,
                pointRadius: 7,
                pointHoverRadius: 10,
                pointBackgroundColor: "red",
                fill: false,
            },
            {
                label: "Net Income",
                data: netIncomeTotals,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderWidth: 4,
                pointRadius: 7,
                pointHoverRadius: 10,
                pointBackgroundColor: "blue",
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 16,
                        family: "Arial, sans-serif",
                    },
                    color: "#444",
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                bodyFont: {
                    size: 14,
                },
                padding: 12,
            },
            title: {
                display: true,
                text: 'Monthly Financial Overview',
                font: {
                    size: 22,
                    weight: 'bold',
                    family: "Arial, sans-serif",
                },
                color: '#222',
                padding: {
                    top: 20,
                    bottom: 40,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months',
                    font: {
                        size: 16,
                        family: "Arial, sans-serif",
                        weight: "bold",
                    },
                    color: "#333",
                },
                grid: {
                    drawBorder: true,
                    borderColor: "#555", // Darker axis line
                    borderWidth: 2, // Thicker axis line
                    drawOnChartArea: false, // No gridlines on the chart
                },
                ticks: {
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                    color: "#222",
                    padding: 10,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                    font: {
                        size: 16,
                        family: "Arial, sans-serif",
                        weight: "bold",
                    },
                    color: "#333",
                },
                beginAtZero: true,
                grid: {
                    drawBorder: true,
                    borderColor: "#555",
                    borderWidth: 2,
                    color: "rgba(200, 200, 200, 0.3)", // Subtle gridlines
                },
                ticks: {
                    stepSize: 1000,
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                    color: "#222",
                    padding: 10,
                },
            },
        },
        elements: {
            line: {
                tension: 0,
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
