import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Saved} from "../assetts/saved.svg";
import { ReactComponent as Explore} from "../assetts/explore.svg";
import { ReactComponent as Login } from "../assetts/login.svg";

const Footer = () => (
    <footer className="flex items-center bg-teal-400 h-16 fixed bottom-0 w-full">
        <div className="flex flex-row w-1/2 mx-auto items-center content-between justify-between ">
            <div className="flex flex-col items-center">
                <Explore />
                <p className="text-xs">Explore</p>
            </div>
            <div className="flex flex-col items-center">
                <Saved />
                <p className="text-xs">Saved</p>
            </div>
            <div className="flex flex-col items-center">
                <Link to="/login">
                    <Login />
                    <p className="text-xs">Login</p>
                </Link>
            </div>
        </div>
    </footer>
)

export default Footer;