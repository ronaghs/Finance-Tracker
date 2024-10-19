import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title }) => {
    // Customize pie chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                    },
                    padding: 20,
                    boxWidth: 20,
                    color: "#333",
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                bodyFont: {
                    size: 14,
                },
                padding: 10,
                boxPadding: 10,
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeOutBounce',
        },
    };

    return (
        <div className="chart-container p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{title}</h3>
            <Pie data={data} options={options} />
        </div>
    );
};

// PropTypes for PieChart
PieChart.propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

export default PieChart;
