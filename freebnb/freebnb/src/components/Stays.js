import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

import DefaultStay from "../assetts/defaultStay1.webp";
import DefaultStay2 from "../assetts/defaultStay2.webp";
import DefaultStay3 from "../assetts/defaultStay3.webp";
import Nav from "./Nav";
import qs from "query-string";

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
    const location = useLocation();
    const  { city, toDate, fromDate, priceLow, priceHigh } = qs.parse(location.search);
    const [toggle, setToggle] = useState(false);
    const [stays, setStays] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const request = new Request(`/stays?city=${city}&toDate=${toDate}&fromDate=${fromDate}&priceLow=${priceLow}&priceHigh=${priceHigh}`)
        async function getStays(){
            try {
                const res = await fetch(request);
                if (res.status >= 200 && res.status <= 400) {
                    const data = await res.json();
                    setStays(data.stays);
                    setLoading(false);
                } else {
                    console.log("an error occurred " + res.statusText);
                }
            } catch (err) {
                console.log("an error occured " + err);
            }
        };
        getStays();
    }, [])

    
    return (
        <>
        <Nav />
        <div className="container px-5 min-h-screen flex flex-col" >
            <header className="h-full p-10">
                <form className="flex flex-col" method="GET" action="/stays">
                    <input
                        type="text" 
                        name="city" 
                        id="city" 
                        className="w-11/12 border h-10 rounded-lg text-center" 
                        placeholder="Search"
                    />
                    <input className="hidden" type="submit" />
                    <span onClick={() => toggle ? setToggle(false) : setToggle(true)} className="mb-5 p-3">+</span>
                    <fieldset className={`flex flex-col ${toggle ? "" : "hidden"} mb-3`}>
                        <div className="flex flex-row">
                            <label>Price min: </label>
                            <input className="border rounded w-16" type="number" pattern="[0-9]{2}.[0-9]{2}" min="0" name="priceLow" />
                            <label>Price max: </label>
                            <input className="border rounded w-16" type="number" pattern="[0-9]{2}.[0-9]{2}" min="0" name="priceHigh" />
                        </div>
                        <div className="flex flex-row">
                            <div>
                                <label>From date: </label>
                                <input type="date" name="fromDate" />
                            </div>
                            <div>
                                <label>To date: </label>
                                <input type="date" name="toDate" />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </header>
            {
                loading 
                ? 
                <Loading />
                :
                <main className="min-h-full">
                    <h4 className="text-sm">300+ stays May 14 - 30</h4>
                    <h1 className="text-3xl font-extrabold mb-3">Stays in Baltimore</h1>
                    { stays.length > 0 ? staysData.map(stay => <Stay key={stay.id} {...stay} />)
                    : <h1>No listings found for that data</h1>}
                </main>
            }
            <footer className="border-t h-20 flex justify-center items-center mt-auto">
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