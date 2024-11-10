import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseconfig";

function useGoals() {
  const [goals, setGoals] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const unsubscribe = onSnapshot(
      collection(db, "goals"),
      (snapshot) => {
        const fetchedGoals = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((goal) => goal.userId === userId); // Filter goals by user
        setGoals(fetchedGoals);
      },
      (error) => console.error("Error fetching goals: ", error)
    );

    return () => unsubscribe();
  }, []);

  const applyIncomeToGoals = async (incomeAmount) => {
    if (!goals || goals.length === 0 || incomeAmount <= 0) return;

    let notificationMessage = "Savings Distributed:\n";
    const updatedGoals = goals.map((goal) => {
      const contribution = (goal.contributionPercentage / 100) * incomeAmount;
      const newSavedAmount = goal.saved + contribution;
      notificationMessage += `${goal.category}: $${contribution.toFixed(2)}\n`;

      return { ...goal, saved: newSavedAmount };
    });

    setGoals(updatedGoals);
    updatedGoals.forEach(async (goal) => {
      try {
        const goalDocRef = doc(db, "goals", goal.id);
        await updateDoc(goalDocRef, { saved: goal.saved });
      } catch (error) {
        console.error(`Error updating goal ${goal.id}:`, error);
      }
    });
    setNotification(notificationMessage);
  };

  return { goals, applyIncomeToGoals, notification, setNotification };
}

export default useGoals;