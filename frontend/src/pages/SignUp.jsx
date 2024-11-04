import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

const SignUp = ()=>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const { signup,error,isLoading } = useSignup()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        await signup(email,password)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>SignUp</h3>

            <label>Email:</label>
            <input 
                type="email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
            ></input>

            <label>Password:</label>
            <input 
                type="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
            ></input>

            <button disabled={isLoading}>Submit</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default SignUp;