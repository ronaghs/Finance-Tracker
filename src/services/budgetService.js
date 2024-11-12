import { db, auth } from "../firebase/firebaseconfig";
import { doc } from "firebase/firestore";
import { collection, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export const saveBudget = async (budgetData) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  if (budgetData.id) {
    // Update existing document if ID is present
    const budgetRef = doc(db, "budgets", budgetData.id);
    await setDoc(budgetRef, { ...budgetData, userId });
  } else {
    // Generate a new document reference to get the ID first
    const budgetRef = doc(collection(db, "budgets"));
    await setDoc(budgetRef, { ...budgetData, id: budgetRef.id, userId });
  }
};

export const deleteBudget = async (budgetId) => {
  return deleteDoc(doc(db, "budgets", budgetId));
};

export const fetchBudgets = (callback) => {
  return onSnapshot(collection(db, "budgets"), (snapshot) => {
    const budgets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(budgets);
  });
};
