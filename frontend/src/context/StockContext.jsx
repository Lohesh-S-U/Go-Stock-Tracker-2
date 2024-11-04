import {createContext, useReducer} from 'react'

export const StocksContext = createContext()

export const stocksReducer = (state,action)=>{
    switch(action.type){
        case 'SET_STOCKS':
            return {
                posts : action.payload
            }
        
        default:
            return state
    }
}

export const StocksContextProvider = ({children})=>{
    const [state,dispatch] = useReducer(stocksReducer , {
        stocks : null
    })

    return (
        <StocksContext.Provider value={{...state,dispatch}}>
            {children}
        </StocksContext.Provider>
    )
}