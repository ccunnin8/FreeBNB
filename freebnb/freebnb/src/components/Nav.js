import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { ReactComponent as Avatar } from "../assetts/avatar.svg";

export default function Nav() {
    const [show, setShow ] = useState(false);
    const toggleMenu = () => {
        setShow(!show);
    }

    return (
        <>
           <nav>
                <div className="absolute right-0 p-3" 
                    onMouseEnter={() => toggleMenu()}>
                    <Avatar height={30} width={30} />
                </div>
                <ul 
                    onMouseLeave={() => toggleMenu()}
                    style={{right: 0, top: 40}} 
                    className={`${show ? "" : "hidden"} absolute p-3 border bg-white`}>
                    <li className="hover:bg-teal-400 border-b border-teal-600">
                        <Link to="/profile">
                            Profile
                        </Link>
                    </li>
                    <li className="hover:bg-teal-400 border-b border-teal-600">
                        <Link to="/reservations">
                            Reservations
                        </Link>
                    </li>
                    <li className="hover:bg-teal-400 border-b border-teal-600">
                        <Link to="/messages">Messages</Link>
                    </li>
                    <li className="hover:bg-teal-400 border-b border-teal-600">
                        <Link to="/stays">Stays</Link>
                    </li>
                </ul>
            </nav>   
        </>
    )
}
