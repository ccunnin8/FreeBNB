import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import UserProvider from '../components/auth/UserContext';


describe("test the landing page", () => {
  test('renders home page', () => {
    const { getByText } = render(
      <UserProvider>
        <App />
      </UserProvider>
    );
    const freebnb = getByText(/FreeBNB/i);
    const login = getByText("Login")
    expect(freebnb).toBeInTheDocument();
    expect(login).toBeInTheDocument();
  });

  test("shows logout if user is logged in", () => {
    const { getByText, queryByText } = render(
      <UserProvider value={{ userState: { loggedIn: true } }}>
        <App />
      </UserProvider>
    )
    const login = queryByText("Login");
    const logout = getByText("Logout")
    expect(login).toNotBeInTheDocument();
    expect(logout).toBeInTheDocument();
  });
})
