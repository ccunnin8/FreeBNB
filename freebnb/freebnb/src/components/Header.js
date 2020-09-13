import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./auth/UserContext";
import Nav from "./Nav"
const Header = () => {
    const { logout, userState } = useContext(UserContext);
    
    return (
        <>
        { userState.loggedIn && <Nav /> }
        <div className="flex items-center justify-between flex-wrap p-6 border-b">
            <div className="flex items-center flex-shrink-0 text-black mr-6">
                <span className="font-semibold text-xl tracking-tight">FreeBNB</span>
            </div>
            <div className="flex items-center justify-between p-6">
                { userState.loggedIn ?
                <>
                    <button onClick={() => logout()} className="hover:underline" to ="/logout">Logout</button>
                </>
                :
                (
                <>
                    <Link className="hover:underline" to="/login">
                        Login
                    </Link>
                    <Link className="hover:underline ml-3" to="/signup">
                        SignUp
                    </Link>
                </>
                )
                }
            </div>
        </div>
        </>
    )
}

export default Header;