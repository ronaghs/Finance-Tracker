// PieChart.js
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";

const PieChart = ({ data, title }) => {
    return (
        <div className="chart-container">
            <h3 className="text-xl font-bold">{title}</h3>
            <Pie data={data} />
        </div>
    );
};

// PropTypes for PieChart
PieChart.propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

export default PieChart;
