import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow p-4">Income</div>
                <div className="bg-white shadow p-4">Expenses</div>
                <div className="bg-white shadow p-4">Savings</div>
                <div className="bg-white shadow p-4">Budget</div>
            </div>
            <button onClick={() => navigate("/budget-tracker")} className="btn">
                Change Income/Expenses
            </button>
        </div>
    );
}

export default Dashboard;
