import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

const GetMonthlyData = () => {
    const [monthlyDataByYear, setMonthlyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize empty monthly data
                const defaultMonthlyData = {};

                // Fetch incomes
                try {
                    const incomeSnapshot = await getDocs(collection(db, "incomes"));
                    incomeSnapshot.forEach((doc) => {
                        const data = doc.data();
                        const date = new Date(data.date);

                        // Get the month and year using UTC methods
                        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
                        const year = date.getUTCFullYear();

                        // Initialize the year and month in the data structure if it doesn't exist
                        if (!defaultMonthlyData[year]) {
                            defaultMonthlyData[year] = {
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
                        }

                        // Push the income data into the corresponding year and month
                        if (defaultMonthlyData[year][month]) {
                            defaultMonthlyData[year][month].income.push({
                                id: doc.id,
                                name: data.name,
                                value: data.value,
                                date: data.date,
                            });
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

                        // Get the month and year using UTC methods
                        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
                        const year = date.getUTCFullYear();

                        // Initialize the year and month in the data structure if it doesn't exist
                        if (!defaultMonthlyData[year]) {
                            defaultMonthlyData[year] = {
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
                        }

                        // Push the expense data into the corresponding year and month
                        if (defaultMonthlyData[year][month]) {
                            defaultMonthlyData[year][month].expenses.push({
                                id: doc.id,
                                name: data.name,
                                value: data.value,
                                date: data.date,
                            });
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
    return { monthlyDataByYear, loading, error };
};

export default GetMonthlyData;
