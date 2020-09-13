import React from "react";
import Homepage from "../../App.js";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import { render, fireEvent, waitForElement, getByPlaceholderText } from "@testing-library/react";
import UserProvider from "../../components/auth/UserContext.js";
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
            <UserProvider state={value}>
                { ui }
            </UserProvider>
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
        const state = {
                loggedIn: true,
                username: "TEST"
        }
        const { getByText } = renderWithRouter(<Header/>, state)
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
        const state =  {
            loggedIn: true,
            username: "TEST"
        }
        const { getByText, findByText } = renderWithRouter(<Header />, state)
        const logout = getByText("Logout");
        fireEvent.click(logout)
        const login = await findByText("Login")
        expect(login).toBeInTheDocument();
    });

    it("should update search value when user starts typing search", async () => {
        const { getByTestId } = render(<Hero />);
        const search = getByTestId("citysearch");
        fireEvent.change(search, { target: { value: "testing"}});
        expect(search.value).toBe("testing");
    });

})