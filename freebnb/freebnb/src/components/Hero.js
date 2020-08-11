import React from "react";
import backgroundImg from "../assetts/herobackground.jpg";
import SearchForm from "./SearchForm";

const Hero = () => (
    <div className="bg-cover min-h-full min-w-full" style={{ backgroundImage: `url(${backgroundImg})`}}>
        <div className="flex flex-col px-5 min-h-full min-w-full">
            <h1 className="my-10 text-white capitalize font-bold ">Why stay in a hotel? Your next stay could be an immersive experience</h1>
        </div>
        <SearchForm />
    </div>
)

export default Hero;