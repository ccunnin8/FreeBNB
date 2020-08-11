import React, { useState } from "react";
import DefaultStay from "../assetts/defaultStay1.webp";
import DefaultStay2 from "../assetts/defaultStay2.webp";
import DefaultStay3 from "../assetts/defaultStay3.webp";
import Nav from "./Nav";


const staysData = [
    { 
        superhost: true,
        type: "private room",
        desc: "2 GLAMOROUS GRAD AND MED STUDENT HOUSING",
        price: 15,
        img: DefaultStay,
        id: 1, 
    }, 
    {
        supehost: false,
        type: "entire apartment",
        desc: "Federal hill Durst st. efficiency/studyio",
        price: 47,
        img: DefaultStay2,
        id: 2
    },
    {
        superhost: false,
        type: "private room",
        desc: "ready like a hotel at a lower price 28th rm 5",
        price: 18,
        img: DefaultStay3,
        id: 3
    },
    {
        superhost: false,
        type: "private room",
        desc: "ready like a hotel at a lower price 28th rm 5",
        price: 18,
        img: DefaultStay3,
        id: 4
    }
]
const Stays = () => {
    return (
        <>
        <Nav />
        <div className="container px-5 min-h-full" >
            <header className="h-20 p-10 mb-3">
                <input 
                    type="text" 
                    name="city" 
                    id="city" 
                    className="w-11/12 border h-10 rounded-lg text-center" 
                    placeholder="Search"
                />
            </header>
            <main className="min-h-full">
                <h4 className="text-sm">300+ stays May 14 - 30</h4>
                <h1 className="text-3xl font-extrabold mb-3">Stays in Baltimore</h1>
                { staysData.map(stay => <Stay key={stay.id} {...stay} />)}
            </main>
            <footer className="border-t h-20 flex justify-center items-center">
                <p>&#169; 2020 FreeBNB, inc. All rights reserved </p>
            </footer>
        </div>
        </>
    )
}

const Stay = ({ img, desc, price, type, superhost}) => (
    <div className="mx-auto w-11/12 h-min-full flex flex-col mb-5">
        <img className="rounded mb-3" 
            style={{height: 300, width: 400}} src={img} alt="where you could stay" />
        <div>
            <p>
                { superhost && <span className="border text-sm rounded p-1 mr-2 uppercase" >Superhost</span>}
                {  type }
            </p>
        </div>
        <p className="font-light text-base my-1">{ desc }</p>
        <p><span className="font-bold">${ price }</span> / night</p>
    </div>
)

export default Stays;