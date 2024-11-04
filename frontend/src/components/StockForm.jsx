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

    async function handleSubmit(e) {
        e.preventDefault();

        if (!user) {
            setError("User not logged in");
            return;
        }

        const stock = { company, amount, price };
        const res = await fetch("http://localhost:3000/api/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stock),
        });
        const response = await fetch("http://localhost:3000/api/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setCompany("");
            setAmount(0);
            setPrice(0);
            setError(null);
            dispatch({ type: "SET_STOCKS", payload: json });
        }
    }

    return (
        <form className="create-stock-form" onSubmit={handleSubmit}>
            <h2>New Stock</h2>

            <label htmlFor="company-input">Company:</label>
            <input
                id="company-input"
                type="text"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
            />

            <label htmlFor="amount-input">Amount:</label>
            <input
                id="amount-input"
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value))}
                value={amount}
            />

            <label htmlFor="price-input">Price:</label>
            <input
                id="price-input"
                type="number"
                onChange={(e) => setPrice(parseInt(e.target.value))}
                value={price}
            />

            <button>Buy Stock</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default StockForm;
