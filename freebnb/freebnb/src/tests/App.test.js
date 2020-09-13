import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import UserProvider from '../components/auth/UserContext';

global.fetch = jest.fn(() => (
  Promise.resolve({
    json: () => Promise.resolve({ })
  })
));

const tokenNotExpired = jest.fn(() => true);

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

  test("expect fetch to be called twice", () => {
    const { getByText, queryByText } = render(
      <UserProvider value={{ userState: { loggedIn: true } }}>
        <App />
      </UserProvider>
    )
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("expect localStorage to be called with token", () => {
    render(
      <UserProvider>
        <App />
      </UserProvider>
    )
    expect(localStorage.getItem).toBeCalledWith("token");
  })
})
