import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import BudgetTracker from "./BudgetTracker";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budget-tracker" element={<BudgetTracker />} />
        </Routes>
    );
}

export default App;