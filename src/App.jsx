import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;