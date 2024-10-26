import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseconfig";

const useBudgets = () => {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const userId = auth.currentUser?.uid; // Get the current user's ID
                if (!userId) return; // Exit if there's no user ID

                // Query to fetch budgets for the current user
                const budgetsQuery = query(
                    collection(db, "budgets"), // Replace with your Firestore collection name
                    where("userId", "==", userId)
                );

                const budgetsSnapshot = await getDocs(budgetsQuery);
                const fetchedBudgets = budgetsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setBudgets(fetchedBudgets); // Set the fetched budgets
            } catch (error) {
                console.error("Error fetching budgets: ", error); // Log any errors
            }
        };

        fetchBudgets();
    }, []); // Empty dependency array to run only once when the component mounts

    return budgets; // Return the fetched budgets
};

export default useBudgets;