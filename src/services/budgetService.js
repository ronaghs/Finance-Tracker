import { db, auth } from "../firebase/firebaseconfig";
import { doc } from "firebase/firestore";
import { collection, addDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export const saveBudget = async (budgetData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not logged in");

    return addDoc(collection(db, "budgets"), {
        ...budgetData,
        userId,
    });
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
