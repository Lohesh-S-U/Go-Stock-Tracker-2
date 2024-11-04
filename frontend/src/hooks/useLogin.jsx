import { useState } from "react";
import { useAuthContext } from './useAuthContext'

export const useLogin = () =>{
    const [error,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async(email,password)=>{
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/api/login',{
            method: 'POST',
            headers : {'Content-Type':'application/json'},
            body: JSON.stringify({email,password}),
            credentials: 'same-origin',
        })
        
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok){
            //save user to Local storage
            console.log('dispatch done')
            localStorage.setItem('user',JSON.stringify(json.user))
            dispatch({type: 'LOGIN',payload: json.user})

            setIsLoading(false)
        }
    }

    return {login,error,isLoading}
}