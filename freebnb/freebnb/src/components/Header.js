import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
    <nav className="flex items-center justify-between flex-wrap p-6 border-b">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
            <span className="font-semibold text-xl tracking-tight">FreeBNB</span>
        </div>
        <div className="flex items-center justify-between p-6">
            <Link className="hover:underline" to="/login">
                Login
            </Link>
            <Link className="hover:underline ml-3" to="/signup">
                SignUp
            </Link>
        </div>
    </nav>
)

export default Header;