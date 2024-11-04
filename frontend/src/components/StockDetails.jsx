import { useStocksContext } from "../hooks/useStocksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const StockDetails = ({ stock }) => {
    const { dispatch } = useStocksContext();
    const { user } = useAuthContext();

    const handleSell = async () => {
        if (!user) {
            return;
        }

        const sellData = { company: stock.company, amount: stock.amount };

        const sellResponse = await fetch("http://localhost:3000/api/sell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sellData),
        });

        if (sellResponse.ok) {
            const getResponse = await fetch("http://localhost:3000/api/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await getResponse.json();

            if (getResponse.ok) {
                dispatch({ type: "SET_STOCKS", payload: json }); // Update the context with new stock data
            } else {
                console.error("Failed to fetch updated stocks:", json.error);
            }
        } else {
            const errorJson = await sellResponse.json();
            console.error("Failed to sell stock:", errorJson.error);
        }
    };

    return (
        <div className="stock-details">
            <h2>{stock.company}</h2>
            <p>Amount: {stock.amount}</p>
            <p>Price per Share: ${stock.price}</p>
            <p>Date Purchased: {new Date(stock.createdAt).toLocaleDateString()}</p>
            <button onClick={handleSell}>Sell Stock</button>
        </div>
    );
};

export default StockDetails;
