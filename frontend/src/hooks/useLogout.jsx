import { useAuthContext } from "./useAuthContext"
import { useStocksContext } from "./useStocksContext"

export const useLogout = ()=>{
    const { dispatch } = useAuthContext();
    const { dispatch:stocksDispatch } = useStocksContext();

    const logout = ()=>{
        localStorage.removeItem('user')

        dispatch({type:'LOGOUT'})
        stocksDispatch({type:'SET_STOCKS',payload:null})
    }

    return { logout }
}