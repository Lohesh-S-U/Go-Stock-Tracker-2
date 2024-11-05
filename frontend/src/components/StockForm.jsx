import { useState } from "react";
import { useStocksContext } from "../hooks/useStocksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const StockForm = () => {
    const { dispatch } = useStocksContext();
    const [company, setCompany] = useState("");
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    const companies = [
        "MSFT", "IBM", "GE", "UNP", "COST", "MCD", "V", "WMT", "DIS",
        "MMM", "INTC", "AXP", "AAPL", "BA", "CSCO", "GS", "JPM", "CRM", "VZ"
    ];

    async function handleSubmit(e) {
        e.preventDefault();

        if (!user) {
            setError("User not logged in");
            return;
        }

        const stock = { company, amount, price };

        // First fetch request to buy stock
        const buyResponse = await fetch("http://localhost:3000/api/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stock),
            credentials: 'include',
        });

        if (!buyResponse.ok) {
            const errorJson = await buyResponse.json();
            setError(errorJson.error);
            return;
        }

        // Second fetch request to get updated stocks
        const getResponse = await fetch("http://localhost:3000/api/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        });

        const json = await getResponse.json();

        if (getResponse.ok) {
            // Clear the form and error, update stocks in context
            setCompany("");
            setAmount(0);
            setPrice(0);
            setError(null);
            dispatch({ type: "SET_STOCKS", payload: json.stocks });
        } else {
            setError(json.error);
        }
    }

    return (
        <form className="create-stock-form" onSubmit={handleSubmit}>
            <h2>New Stock</h2>

            <label htmlFor="company-select">Company:</label>
            <select
                id="company-select"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
            >
                <option value="" disabled>Select a company</option>
                {companies.map((comp) => (
                    <option key={comp} value={comp}>
                        {comp}
                    </option>
                ))}
            </select>

            <label htmlFor="amount-input">Amount:</label>
            <input
                id="amount-input"
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value))}
                value={amount}
                min="1"
            />

            <label htmlFor="price-input">Price:</label>
            <input
                id="price-input"
                type="number"
                onChange={(e) => setPrice(parseInt(e.target.value))}
                value={price}
                min="1"
            />

            <button>Buy Stock</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default StockForm;
