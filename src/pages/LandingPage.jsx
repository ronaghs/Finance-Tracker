import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import trackingss from "../images/trackingss.png";
import goalss from "../images/goalss.png";
import dashboardss from "../images/dashboardss.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <ResponsiveAppBar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4">
            Welcome to Finance Tracker
          </h1>
          <p className="text-xl mb-6">
            Manage your finances easily and efficiently
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track Expenses */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={trackingss}
                alt="Track Expenses"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Track Expenses</h3>
              <p>
                Easily track expenses with our simple-to-use tools and
                understand your spending habits.
              </p>
            </div>

            {/* Set Goals */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img src={goalss} alt="Set Goals" className="mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Set Goals</h3>
              <p>
                Set and achieve financial goals by keeping a close eye on your
                savings and income.
              </p>
            </div>

            {/* Dashboard Overview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={dashboardss}
                alt="Dashboard Overview"
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Dashboard Overview
              </h3>
              <p>
                Get a complete snapshot of your financial standing at a glance
                with our intuitive dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Tracking Your Finances Today!
          </h2>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100"
          >
            Create an Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-white text-center">
        <p>
          © {new Date().getFullYear()} Finance Tracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
