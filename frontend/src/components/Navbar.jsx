import {Link} from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Navbar(){
    const {logout} = useLogout()
    const { user } = useAuthContext()

    const handleClick = ()=>{
        logout();
    }

    return (
        <header>
            <div className="container">
                <Link to='/'>
                    <h1>Go-Stock-Tracker</h1>
                </Link>
                <nav className="nav-sidebar">
                    {user && (<div>
                        <span>{user.Email}</span>
                        <button onClick={handleClick}>Logout</button>
                    </div>)}
                    {!user && (<div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">SignUp</Link>
                    </div>)}
                </nav>
            </div>
        </header>
    )
}