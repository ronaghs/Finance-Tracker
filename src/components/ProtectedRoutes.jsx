import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/firebaseconfig"; // Ensure the correct path to your firebaseConfig

function ProtectedRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the auth state changes
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Loading indicator while waiting for auth check
    return <div>Loading...</div>;
  }

  // If user is authenticated, render the Outlet (protected components)
  // Otherwise, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
