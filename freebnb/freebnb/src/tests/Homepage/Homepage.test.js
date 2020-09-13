import React, { useContext} from "react";
import Homepage from "../../App.js";
import Header from "../../components/Header";
import { render, fireEvent } from "@testing-library/react";
import UserProvider, { UserContext } from "../../components/auth/UserContext.js";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";


const renderWithProvider = (ui, value) => {
    return render(
        <UserProvider value={{...value}} >
            {ui}
        </UserProvider> 
    )
}

const renderWithRouter = (ui, value) => {
    const history = createMemoryHistory();
    return render(
        <Router history={history}>
            <UserContext.Provider value={value}>
                { ui }
            </UserContext.Provider>
        </Router>
    )
}
describe("test homepage", () => {
    it("renders homepage", () => {
        const { getByText } = renderWithProvider(<Homepage />);
        const freebnb = getByText("FreeBNB");
        expect(freebnb).toBeInTheDocument();
    });

    it("it shows login when user is not logged in", () => {
        const { getByText } = renderWithProvider(<Homepage />);
        const login = getByText("Login");
        expect(login).toBeInTheDocument();
    });

    it("shows logout when user is logged in", () => {
        const value = {
            userState: {
                loggedIn: true,
                username: "TEST"
            },
        }
        const { getByText } = renderWithRouter(<Header/>, value)
        const logout = getByText("Logout");
        expect(logout).toBeInTheDocument(); 
    });

    it("should navigate to login when login is clicked", () => {
        const { getByText } = renderWithProvider(<Homepage />);
        const login = getByText("Login");
        fireEvent.click(login);
        const notMemberSignup = getByText("Not a member? Sign Up");
        expect(notMemberSignup).toBeInTheDocument();
    });

    it("clicking on logout should logout user", async () => {
        const value = {
            userState: {
                loggedIn: true,
                username: "TEST"
            },
            // logout: jest.fn(() => {
            //     return Promise.resolve();
            // })
        }
        const { getByText, findByText } = renderWithRouter(<Header />, value)
        const logout = getByText("Logout");
        fireEvent.click(logout)
        expect(value.logout).toHaveBeenCalledTimes(1);
        const login = await findByText("Login")
        expect(login).toBeInTheDocument();
    });

})