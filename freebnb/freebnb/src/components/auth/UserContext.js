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
            console.log("user logged in?");
            return {
                ...state,
                user: action.user,
                loggedIn: true 
            }
        default:
            return state;
    }
}

const UserProvider = ({children}) => {
    const [userState, userDispatch] = useReducer(reducer, defaultState);
    
    return (
        <UserContext.Provider value={{userState, userDispatch}}>
            { children }
        </UserContext.Provider>
    )
}

export default UserProvider