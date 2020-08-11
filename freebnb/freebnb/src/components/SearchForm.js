import React, { useState } from "react";
import Calendar from "@bit/nexxtway.react-rainbow.calendar";

const parseDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`
}


const SearchForm = () => {
    const [location, setLocation] = useState("");
    const [toDate, setToDate] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [numGuests, setNumGuests] = useState(undefined);
    const [hidden, setHidden] = useState(true);
    const [modal, setModal] = useState("");
    const handleLocationChange = (e) => setLocation(e.target.value);
    const handleNumGuestsChange = (e) => setNumGuests(e.target.value);
    const hideDates = () => setHidden(true);

    const openDates = (type) => {
        setModal(type)
        setHidden(false);
    }
    
    const handleSetDate = (value) => {
        setHidden(true);
        modal === "depart" ? setToDate(value) : setFromDate(value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(location, toDate, fromDate, numGuests)
    }
    return ( 
    <>
        <div className="relative max-width-s py-5">
        <div className="min-h-full min-w-full top-0 absolute bg-gray-100 opacity-25"></div>
        <form className="relative mx-auto w-5/6 flex flex-col justify-between content-between" onSubmit={(e) => handleSubmit(e) }>
            <input 
                className="h-10 mb-5 rounded pl-3" type="text" placeholder="Where do you want to go?" 
                value={location} onChange={(e) => handleLocationChange(e)}
            />
            {fromDate && toDate && fromDate > toDate && <p className="font-bold text-red-100 text-small">Arrival date must be before departure date</p>}
            <div className="flex align-between max-w-s mb-5">
                <input 
                    readOnly
                    className="h-10 rounded pl-3" 
                    type="text" 
                    placeholder="Arrive" 
                    onFocus={() => openDates("arrive")}
                    value={parseDate(fromDate)}
                />
                <input 
                    readOnly
                    className="h-10 ml-auto rounded pl-3"
                    type="text" 
                    placeholder="Depart" 
                    onFocus={() => openDates("depart")}
                    value={parseDate(toDate)}
                />
            </div>
            { numGuests && numGuests < 1 && <p className="font-bold text-red-100 text-small">Number of guests must be at least one</p>}
            <input 
                className="h-10 mb-5 rounded pl-3" 
                type="number" 
                placeholder="Guests" 
                min={1}
                value={numGuests}
                onChange={e => handleNumGuestsChange(e) }
            />
            <button 
                disabled={fromDate > toDate}
                className="text-white font-bold text-2xl h-10 bg-teal-500 rounded">Search</button>
        </form>
    </div>
    <div className={`${hidden ? "hidden" : "" } bg-white opacity-1 z-20 absolute top-0 left-0 min-w-full min-h-full`}>
        <div className="flex p-5">
            <button className="border-none hover:text-gray-500 mr-auto">Clear</button>
            <span>Select your check-in date </span>
            <button 
                onClick={() => hideDates()} className="border-none hover:text-gray-500 outline-none ml-auto">X</button>
        </div>
        <div className="w-2/3 mx-auto">
            { modal === "arrive" &&  
            <div>
                <h1>Start Date:</h1>
                <Calendar value={fromDate} minDate={new Date()} onChange={value => handleSetDate(value)} />
            </div>
            }
            { modal === "depart" &&
            <div>
                <h1>End Date:</h1>
                <Calendar value={fromDate} minDate={fromDate} onChange={value => { handleSetDate(value)}} />
            </div>
            }
        </div>
    </div>
    </>
    )
}

export default SearchForm;