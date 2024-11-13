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
    if (!goals || goals.length === 0 || incomeAmount <= 0) return incomeAmount;

    console.log("Initial Income Amount:", incomeAmount); // Debug
    let remainingIncome = incomeAmount;
    let notificationMessage = "Savings Distributed:\n";

    const updatedGoals = [];

    for (const goal of goals) {
      if (remainingIncome <= 0) break;

      const contribution = Math.min(
        (goal.contributionPercentage / 100) * incomeAmount,
        goal.amount - goal.saved
      );

      if (contribution > 0) {
        const newSavedAmount = goal.saved + contribution;
        remainingIncome -= contribution;

        updatedGoals.push({ ...goal, saved: newSavedAmount });

        try {
          const goalDocRef = doc(db, "goals", goal.id);
          await updateDoc(goalDocRef, { saved: newSavedAmount });
          console.log(
            `Updated Goal: ${goal.category}, Contribution: ${contribution}`
          ); // Debug
        } catch (error) {
          console.error(`Error updating goal ${goal.id}:`, error);
        }

        notificationMessage += `${goal.category}: $${contribution.toFixed(
          2
        )}\n`;
      }
    }

    console.log("Remaining Income After Contributions:", remainingIncome); // Debug
    setGoals(updatedGoals);
    setNotification(notificationMessage);
    return remainingIncome;
  };

  return { goals, applyIncomeToGoals, notification, setNotification };
}

export default useGoals;
