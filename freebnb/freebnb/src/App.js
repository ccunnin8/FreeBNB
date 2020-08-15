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
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ContinueSignup } from './components/AddPhoto';
import Messages, { Chat } from './components/Messages';
import Profile from "./components/Profile";
import Reservations from './components/Reservations';
import Cookie from "js-cookie";

const carouselData = [
  { title: "mountains", subtitle: "view houses in the mountains", img: Mountains },
  { title: "beach", subtitle: "view houses on the beach", img: Beach},
  { title: "countryside", subtitle: "get away from the city", img: Countryside }
]

const tokenNotExpired = () => {
  // checks if token-refresh-date exists
  // returns true if date <= 7 days, false otherwise 
  let last = localStorage.getItem("token-refresh-date")
  if (last) {
    const now = new Date();
    return ((now - last) / (1000 * 24 * 60 * 60)) <= 7;
  } 
  return false;
}
const Homepage = () => (
  <div className="container mx-auto">
        <Header />
        <Hero />
        <Carousel title={"Find spaces that suit your style"} cards={carouselData} />

    </div>
)

function App() {
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
        } else {
          console.log("error", data);
        }
      })();
    // if token is expired, remove token, refreshdate, username and 
    // make user log in again 
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("token-refresh-date");
      localStorage.removeItem("username");
    }
  }, [])
  return (
    <Router>
      <div className="container mx-auto">
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <Route exact path="/continue_signup">
                <ContinueSignup />
              </Route>
              <Route exact path="/stays">
                <Stays />
              </Route>
              <Route exact path="/stay/:id">
                <Stay />
              </Route>
              <Route exact path="/messages">
                <Messages />
              </Route>
              <Route exact path="/messages/:id">
                  <Chat />
              </Route>
              <Route exact path="/">
                <>
                  <Homepage />
                  <Footer />
                </>
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Route exact path="/reservations">
                <Reservations />
              </Route>
            </Switch>
      </div>
    </Router>
  );
}

export default App;
