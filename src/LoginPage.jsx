import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Add your login logic here
        navigate("/dashboard");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-5xl">Login Page</h1>
            <button onClick={handleLogin} className="btn">
                Login
            </button>
        </div>
    );
}

export default LoginPage;