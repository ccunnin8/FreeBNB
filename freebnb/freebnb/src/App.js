import React, { useEffect, useContext } from 'react';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Stays from "./components/Stays";
import Stay from "./components/Stay";
import { Login, Signup } from "./components/LoginSignup";
import Beach from "./assetts/beach.jpg";
import Mountains from "./assetts/mountains.jpg";
import Countryside from "./assetts/countryside.jpg";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { ContinueSignup } from './components/AddPhoto';
import Messages, { Chat } from './components/Messages';
import Profile from "./components/Profile";
import Reservations from './components/Reservations';
import Cookie from "js-cookie";
import { UserContext } from './components/auth/UserContext';
import PrivateRoute from './components/PrivateRoute';
import { tokenNotExpired } from "./components/auth/tokenNotExpired";
import EditListing from "./components/EditListing";
import FormProvider from './components/form/Context/FormContext';

const carouselData = [
  { title: "mountains", subtitle: "view houses in the mountains", img: Mountains },
  { title: "beach", subtitle: "view houses on the beach", img: Beach},
  { title: "countryside", subtitle: "get away from the city", img: Countryside }
]


const Homepage = () => (
  <div className="container mx-auto">
        <Header />
        <Hero />
        <Carousel title={"Find spaces that suit your style"} cards={carouselData} />

    </div>
)

function App() {
  const { login, logout } = useContext(UserContext);

  useEffect(() => {
    // get csrf token from the server for post requests 
    (async function setCookie() {
      const request = new Request("/csrf");
      const res = await fetch(request);
      const data = await res.json();
      Cookie.set("csrf", data.csrf);
    })();
    // check and see if token exists (ie, user is logged in)
    // and check to make sure token is not too old (ie < 7 days old)
    if (localStorage.getItem("token") && tokenNotExpired) {
      (async function getUserData() {
        // send token and username to server get user back 
        const request = new Request("/refresh_token");
        const headers = new Headers()
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`)
        const body = JSON.stringify({ 
          username: localStorage.getItem("username"),
          token: localStorage.getItem("token")
        });
        // async fetch, convert to json 
        const res = await fetch(request, { headers, method: "POST", body });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("token-refresh-date", new Date())
          login(data.user);
        } else {
          console.log("error", data);
          logout();
        }
      })();
    // if token is expired, remove token, refreshdate, username and 
    // make user log in again 
    } else {
      logout();
    }
  }, [])
  return (
    <Router>
      <div className="container mx-auto">
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <PrivateRoute exact path="/continue_signup">
                <ContinueSignup />
              </PrivateRoute>
              <Route exact path="/stays">
                <Stays />
              </Route>
              <Route exact path="/stay/:id">
                <Stay />
              </Route>
              <PrivateRoute exact path="/messages">
                <Messages />
              </PrivateRoute>
              <PrivateRoute exact path="/messages/:id">
                  <Chat />
              </PrivateRoute>
              <Route exact path="/">
                <>
                  <Homepage />
                  <Footer />
                </>
              </Route>
              <PrivateRoute path="/profile">
                <Profile />
              </PrivateRoute>
              <PrivateRoute exact path="/reservations">
                <Reservations />
              </PrivateRoute>
              <PrivateRoute exact path="/stay/:id/edit">
                <FormProvider>
                  <EditListing />
                </FormProvider>
              </PrivateRoute>
            
      </div>
    </Router>
  );
}

export default App;
