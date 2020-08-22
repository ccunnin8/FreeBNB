import React, { createContext, useReducer } from "react";

const defaultState = {
    user: {},
    loggedIn: false,
    reservations: [],
    messages: []
}

export const UserContext = createContext();


const reducer = (state, action) => {
    switch(action.type) {
        case "updateValue":
            return {
                ...state,
                [action.key]: action.value
            };
        case "login":
            return {
                ...state,
                user: action.user,
                loggedIn: true 
            }
        case "logout":
            localStorage.clear();
            return {
                ...state,
                user: null,
                loggedIn: false,
                reservations: [],
                stays: []
            }
        default:
            console.log("default case");
            return state;
    }
}

const UserProvider = ({children}) => {
    const [userState, dispatch] = useReducer(reducer, defaultState);

    const login = (user) => dispatch({ type: "login", user});
    const logout = () => dispatch({ type: "logout"});

    return (
        <UserContext.Provider value={{userState, login, logout}}>
            { children }
        </UserContext.Provider>
    )
}

export default UserProvider