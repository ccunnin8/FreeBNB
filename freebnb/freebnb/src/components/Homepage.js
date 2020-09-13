
import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Carousel from "./Carousel";
import Beach from "../assetts/beach.jpg";
import Mountains from "../assetts/mountains.jpg";
import Countryside from "../assetts/countryside.jpg";

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

export default Homepage;
  