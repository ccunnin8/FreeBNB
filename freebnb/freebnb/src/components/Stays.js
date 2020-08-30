import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Loading from "./Loading";
import Nav from "./Nav";
import qs from "query-string";


let autocomplete; 

const Stays = () => {
    const location = useLocation();
    const  { city, toDate, fromDate, priceLow, priceHigh, state } = qs.parse(location.search);
    const [toggle, setToggle] = useState(false);
    const [stays, setStays] = useState(null);
    const [loading, setLoading] = useState(true);
    const autoCompleteRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);
    const searchRef = useRef(null);
    const submitRef = useRef(null); 

    useEffect(() => {
        const request = new Request(`/stays?city=${city || ""}&state=${state || ""}&toDate=${toDate || ""}&fromDate=${fromDate || ""}&priceLow=${priceLow || ""}&priceHigh=${priceHigh || ""}`)
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
    }, [city, fromDate, toDate, priceLow, priceHigh])

    useEffect(() => {
        const googleUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
        const loadScript = (url, callback) => {
            // make new script and attach to head 
            const googleApiScript = document.getElementById("googleMapsAPI")
            if (!googleApiScript) {
                const script = document.createElement("script")
                script.src = url;
                script.id = "googleMapsAPI"
                document.getElementsByTagName("head")[0].appendChild(script);
                // make sure script is loaded 
                script.addEventListener("load", () => {
                    callback();
                }); 
            }
        }; 

        loadScript(googleUrl, () => {
            // callback that binds google autocomplete api to search bar 
            const options = {
                types: ["(cities)"],
                componentRestrictions: { country: "US" }
            }
            autocomplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, options);
            
            window.google.maps.event.addListener(autocomplete, "place_changed", () => {
                // event listener that submits the form with the correct place data 
                const place = autocomplete.getPlace();
                if (!place.formatted_address) {
                    handleChange(place.name)
                } else {
                    handleChange(place.formatted_address)
                }
            });
        });

    }, [])

    const handleChange = (val) => {
        // parses city, state and injects it into form so that it appears in query string 
        const parts = val.split(",");
        cityRef.current.value = parts[0]?.toLowerCase().trim();
        stateRef.current.value = parts[1]?.toLowerCase().trim();
    }

    const handleSubmit = (e) => {
        if (e.keyCode === 13) {
            alert("you typed enter!");
        }
        e.preventDefault();
        searchRef.current.submit();
    }
    
   
    return (
        <>
        <Nav />
        <div className="container px-5 min-h-screen flex flex-col" >
            <header className="h-full p-10">
                <form ref={searchRef} onSubmit={e => handleSubmit(e)} className="flex flex-col" method="GET" action="/stays">
                    <div className="flex flex-row">
                        <input onKeyDown={ e => {
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                submitRef.current.focus();
                            } 
                        }}
                            type="text" 
                            id="city" 
                            ref={autoCompleteRef}
                            className="w-11/12 border h-10 rounded-lg text-center border-r-0 rounded-r-none" 
                            placeholder="Search"
                        />
                        <input ref={submitRef} className="btn bg-blue-500 rounded border-l-0 p-2 rounded-l-none hover:text-white" type="submit" value="search" />
                    </div>
                    <input type="hidden" ref={cityRef} name="city" />
                    <input type="hidden" ref={stateRef} name="state" />
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
                    <h1 className="text-3xl font-extrabold mb-3">{ city ? `Stays in ${city}` : "latest listings"}</h1>
                    { stays.length > 0 ? stays.map(stay => <Stay key={stay.id} {...stay} />)
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

const Stay = ({ id, photos, description, price_per_night, type, owner}) => (
    <Link to={`/stay/${id}`}>
        <div className="mx-auto w-11/12 h-min-full flex flex-col mb-5">
            <img className="rounded mb-3" 
                style={{height: 300, width: 400}} src={photos[0]?.image} alt="where you could stay" />
            <div>
                <p>
                    { owner.superhost && <span className="border text-sm rounded p-1 mr-2 uppercase" >Superhost</span>}
                    {  type }
                </p>
            </div>
            <p className="font-light text-base my-1">{ description }</p>
            <p><span className="font-bold">${ price_per_night }</span> / night</p>
        </div>
    </Link>
)

export default Stays;