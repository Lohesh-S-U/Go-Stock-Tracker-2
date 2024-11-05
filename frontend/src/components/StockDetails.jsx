import { useEffect,useState } from "react";
import { useStocksContext } from "../hooks/useStocksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const StockDetails = ({ stock }) => {
    const { dispatch } = useStocksContext();
    const { user } = useAuthContext();
    const [sellAmount, setSellAmount] = useState(""); // State for sell amount
    const [priceChange, setPriceChange] = useState(0);

    const handleSell = async () => {
        if (!user || !sellAmount) {
            return;
        }

        const sellData = { company: stock.Company, amount: parseInt(sellAmount, 10) };

        const sellResponse = await fetch("http://localhost:3000/api/sell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sellData),
            credentials: 'include',
        });

        if (sellResponse.ok) {
            const getResponse = await fetch("http://localhost:3000/api/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            const json = await getResponse.json();

            if (getResponse.ok) {
                dispatch({ type: "SET_STOCKS", payload: json.stocks });
            } else {
                console.error("Failed to fetch updated stocks:", json.error);
            }
        } else {
            const errorJson = await sellResponse.json();
            console.error("Failed to sell stock:", errorJson.error);
        }
    };

    useEffect(() => {
        const randomPriceChange = (Math.random() * 4 - 2).toFixed(2); // Random value between -2 and +2
        setPriceChange(randomPriceChange);
    }, [sellAmount]);

    return (
        <div className="stock-details">
            <h2>{stock.Company}</h2>
            <p>Amount Owned: {stock.Amount}</p>
            <p>Price per Share: ${stock.Price}</p>
            <p>Date Purchased: {new Date(stock.CreatedAt).toLocaleDateString()}</p>
            <p>Price Change %: {priceChange}%</p>
            {/* Input for specifying the amount to sell */}
            <label>
                Sell Amount:
                <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    min="1"
                    max={stock.Amount} // Limit to the amount owned
                />
            </label>

            <button onClick={handleSell}>Sell Stock</button>
        </div>
    );
};

export default StockDetails;

