import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-5xl">Welcome to Finance Tracker</h1>
            <button onClick={() => navigate("/login")} className="btn">
                Go to Login
            </button>
        </div>
    );
}

export default LandingPage;