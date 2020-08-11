import React from 'react';
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
