import { useEffect } from "react";
import StockDetails from "../components/StockDetails";
import StockForm from "../components/StockForm";
import { useStocksContext } from "../hooks/useStocksContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Home() {
    const { stocks, dispatch } = useStocksContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchStocks = async () => {
            const response = await fetch("http://localhost:3000/api/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'same-origin',
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "SET_STOCKS", payload: json });
            }
        };

        if (user) {
            fetchStocks();
        }
    }, [dispatch, user]);

    return (
        <div className="home">
            <div className="stocks">
                {stocks && stocks.map((stock) => (
                    <StockDetails key={stock.id} stock={stock} />
                ))}
            </div>
            <StockForm />
        </div>
    );
}
