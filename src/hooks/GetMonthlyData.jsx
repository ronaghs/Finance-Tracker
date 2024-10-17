import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig"; // Adjust the path according to your project structure

const GetMonthlyData = () => {
    const [monthlyData, setMonthlyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize empty monthly data
                const defaultMonthlyData = {
                    January: { income: [], expenses: [] },
                    February: { income: [], expenses: [] },
                    March: { income: [], expenses: [] },
                    April: { income: [], expenses: [] },
                    May: { income: [], expenses: [] },
                    June: { income: [], expenses: [] },
                    July: { income: [], expenses: [] },
                    August: { income: [], expenses: [] },
                    September: { income: [], expenses: [] },
                    October: { income: [], expenses: [] },
                    November: { income: [], expenses: [] },
                    December: { income: [], expenses: [] },
                };

                // Fetch incomes
                try {
                    const incomeSnapshot = await getDocs(collection(db, "incomes"));
                    incomeSnapshot.forEach((doc) => {
                        const data = doc.data();
                        const date = new Date(data.date);

                        // Get the month using UTC methods
                        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });

                        if (defaultMonthlyData[month]) {
                            defaultMonthlyData[month].income.push({ id: doc.id, name: data.name, value: data.value, date: data.date });
                        } else {
                            console.warn("Invalid Month:", month);
                        }
                    });
                } catch (error) {
                    console.error("Error fetching incomes:", error);
                }

                // Fetch expenses
                try {
                    const expenseSnapshot = await getDocs(collection(db, "expenses"));
                    expenseSnapshot.forEach((doc) => {
                        const data = doc.data();
                        const date = new Date(data.date);

                        // Get the month using UTC methods
                        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });

                        if (defaultMonthlyData[month]) {
                            defaultMonthlyData[month].expenses.push({ id:doc.id, name: data.name, value: data.value, date: data.date });
                        } else {
                            console.warn("Invalid Month:", month);
                        }
                    });
                } catch (error) {
                    console.error("Error fetching expenses:", error);
                }

                // Update state with fetched data
                setMonthlyData(defaultMonthlyData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { monthlyData, loading, error };
};

export default GetMonthlyData;