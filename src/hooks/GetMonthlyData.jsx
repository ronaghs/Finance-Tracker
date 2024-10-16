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
                            defaultMonthlyData[month].income.push({ name: data.name, value: data.value });
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
                            defaultMonthlyData[month].expenses.push({ name: data.name, value: data.value });
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



/*import { useState, useEffect } from "react";

const GetMonthlyData = () => {
    const [monthlyData, setMonthlyData] = useState({});

    useEffect(() => {
        const fetchData = () => {
            const defaultMonthlyData = {
                January: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                February: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                March: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                April: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                May: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                June: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                July: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                August: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                September: { income: [{ name: "Job Salary", value: 5000 }, { name: "Freelance", value: 1500 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Groceries", value: 300 }] },
                October: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                November: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] },
                December: { income: [{ name: "Job Salary", value: 5000 }, { name: "Side Business", value: 2000 }], expenses: [{ name: "Rent", value: 1200 }, { name: "Utilities", value: 200 }] }
            };

            setMonthlyData(defaultMonthlyData);
        };

        fetchData();
    }, []);

    return monthlyData;
};

export default GetMonthlyData;*/
