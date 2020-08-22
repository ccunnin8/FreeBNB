import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Saved} from "../assetts/saved.svg";
import { ReactComponent as Explore} from "../assetts/explore.svg";
import { ReactComponent as Login } from "../assetts/login.svg";
import { UserContext } from "./auth/UserContext";

const FooterWrapper = ({children}) => {
    const { userState } = useContext(UserContext)
    return <Footer loggedIn={userState.loggedIn} />
}

const Footer = (loggedIn) => (
    <footer className="flex items-center bg-teal-400 h-16 fixed bottom-0 w-full">
        <div className="flex flex-row w-1/2 mx-auto items-center content-between justify-between ">
            
            <Link to="/stays">
                <div className="flex flex-col items-center">
                        <Explore />
                        <p className="text-xs">Explore</p>
                </div>
            </Link>

            <div className="flex flex-col items-center">
                <Saved />
                <p className="text-xs">Saved</p>
            </div>
            { !loggedIn &&
            <Link to="/login">
                <div className="flex flex-col items-center">
                    <Login />
                    <p className="text-xs">Login</p>
                </div>
            </Link>
            }
        </div>
    </footer>
)

export default FooterWrapper;