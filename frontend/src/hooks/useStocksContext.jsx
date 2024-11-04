import { StocksContext } from "../context/StockContext";
import { useContext } from "react";

export const useStocksContext = ()=>{
    const context = useContext(StocksContext)

    if(!context){
        throw Error("useStocksContext must be used inside the ContextProvider")
    }

    return context
}