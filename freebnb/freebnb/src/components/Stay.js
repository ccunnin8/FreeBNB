import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import { Map, TileLayer } from "react-leaflet";
import "../../node_modules/leaflet/dist/leaflet.css";
import Loading from "./Loading";
import Geocode from "react-geocode";
import Calendar from "@bit/nexxtway.react-rainbow.calendar";

Geocode.setApiKey(process.env.REACT_APP_GEOCODING)

const displayRoomType = (type) => {
    switch (type) {
        case "W":
            return "Whole Home";
        case "P":
            return "Private Room";
        case "S":
            return "Shared Room";
        default:
            return "Home"
    }
}

const getReviewAverage = (reviews) => {
    let total = 0
    for (let review of reviews) {
        total += review.rating;
    }
    return Math.floor(total / reviews.length );
}

const createStars = (count) => {
    let output = ""
    for (let i = 0; i < count; i++) {
        output += " &#10030; " 
    }
    return output
}
const Review = ({ user, review }) => (
    <div className="py-3">
        <div className="flex flex-row items-center mb-2" style={{ width: "20%"}}>
            <div className="rounded-full bg-red-300 mr-auto" style={{height: 20, width: 20}}></div>
            <h2>{user.first_name}</h2>
        </div>
        <p>{review}</p>
    </div>
)

const Stay = () => {
    const [data, setData] = useState({})
    const [show, setShow] = useState("main")
    const [geoData, setGeodata] = useState({});
    const [loading, setLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    const { id } = useParams();
    
    useEffect(() => {
        (async function getData () {
            const request = new Request(`/stay/${id}`)
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `JWT ${localStorage.getItem("token")}`)
            try {
                const res = await fetch(request, { method: "GET", headers });
                const data = await res.json();
                if (res.status >= 200 && res.status <= 400) {
                    setData(data);
                    setLoading(false);
                    const geoData = await Geocode.fromAddress(`${data.address.city}, ${data.address.state}`)
                    const { geometry } = geoData?.results[0];
                    setGeodata({ lat: geometry.location.lat, lng: geometry.location.lng })
                } else {
                    console.log("an error occurred getting the data");
                }
            } catch (err) {
                console.log("There was an error ", err);
            }
        })();
    }, [])
    const pluralize = (arr) => {
        if (Array.isArray(arr)) {
            return arr.length > 1 ? "s" : ""
        } else if (Number.isInteger(arr)) {
            return arr > 1 ? "s" : ""
        }
    }
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Look at this FreeBNB Listing!",
                url: window.location.href 
            })
        } else {
            alert("your browser doesnt allow sharing");
        }
    }

    const handleSave = () => {
        alert("saved to your favorites");
    }
    return ( loading ? <Loading /> : (
        <>  
            {toggle && <Modal handleClick={() => setToggle(!toggle)} price={data.price_per_night} /> }
            <div className={show === "main" ? "" : "hidden" }>
                <nav className="w-full h-20 w-11/12">
                    <ul className="mx-auto flex flex-row py-6 w-11/12">
                        <li className="mr-auto"><button onClick={() => window.history.back()}>Back</button></li>
                        { navigator.share && <li><button onClick={() => handleShare()}>Share</button></li> }
                        <li className="ml-2"><button onClick={() => handleSave() }>Save</button></li>
                    </ul>
                </nav>
                <section>
                    <img className="w-full mb-10" style={{height: 400}}  src={data?.photos[0]?.image} alt="where you could be staying" />
                </section>
                <div className="w-11/12 mx-auto">
                    <button onClick={() => setToggle(true)}
                        className="text-white bg-red-600 active:bg-red-800 p-2 rounded active:border active:border-black focus:shadow-outline">Request to Stay</button>
                    <section className="border-b-2 pb-3">
                        <h1 className="text-3xl font-bold mb-2">{data.headline}</h1>
                        <p>{data.description}</p>
                        <h3>
                            <span className="text-red-600" dangerouslySetInnerHTML={{ __html: createStars(getReviewAverage(data?.reviews))}}></span>
                            <span className="ml-3">({data?.reviews.length})</span>
                            <span className="ml-3 capitalize">{data?.address?.city}</span> <span className="uppercase">{data?.address?.state}</span>
                        </h3>
                    </section>
                    <section className="flex flex-row border-b-2 my-2 pb-3">
                            <div className="mr-auto">
                                <h2 className="capitalize my-2 font-bold">{displayRoomType(data?.room_type)}</h2>
                                <h2 className="font-bold">hosted by <span className="capitalize my-2">{data?.owner?.first_name}</span></h2>
                                { data?.rooms && <ul className="mt-3 flex flex-row w-full">
                                    <li className="mx-2">
                                    {data?.rooms.length} bedroom{pluralize(data?.rooms)} 
                                    </li>
                                    <li className="mx-2">
                                    {data?.bathrooms} bathroom{pluralize(data?.bathrooms)}
                                    </li>
                                    <li className="mx-2">
                                    {data?.rooms.reduce((prev, cur) => cur.bed ? prev + 1 : 0, 0)} bed{pluralize(data?.rooms.map(x => x.bed))}
                                    </li>
                                </ul> }
                            </div>
                            <div>
                                <div className="m-3 rounded-full bg-red-700" style={{width: 30, height: 30}}></div> 
                            </div>
                    </section>
                    <section className="border-b-2 my-4 pb-2">
                        <h1 className="text-lg font-bold">Amenities</h1>
                        <ul>
                            { data.amenities && data?.amenities.map(a => <li key={Math.random() * 10 + 1} className="my-4">{a.amenity}</li>)}
                        </ul>
                        <button onClick={() => setShow("amenities")}
                                className="border-2 rounded shadow p-2 mx-auto w-11/12">Show all amenities</button>
                    </section>
                    <section className="border-b-2 pb-4 mb-2">
                        <h1 className="text-lg font-bold mb-3">Location</h1>
                    { (geoData.lat && geoData.lng ) ? (
                            <Map center={[geoData.lat, geoData.lng]} zoom={13}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                                />
                            </Map> ): 
                            <h2>Map not available</h2>
                    }
                    </section>
                    <section className="border-b-2 pb-3">
                        <h1 className="text-lg font-bold mb-3">
                            <span className="text-red-600" dangerouslySetInnerHTML={{ __html: createStars(getReviewAverage(data?.reviews))}}></span> { data.rating } ({ data.reviews.length })
                        </h1>
                        { data.reviews && data?.reviews.map( review => <Review key={review.id} {...review } />)}
                    </section>
                    <section className="py-2 w-min-full">
                        <h1 className="text-xl font-bold">Rules</h1>
                        <div>
                            { data.rules && Object.keys(data.rules).splice(0, 3).map((rule, index) => (
                                <p className="capitalize mb-2" key={index}>
                                {rule.split("_").join(" ")}: {data.rules[rule].toString()}</p>
                            ))}
                            <button onClick={() => setShow("rules")}
                                className="border-2 rounded shadow p-2 mx-auto w-11/12">Show all rules</button>
                        </div>
                    </section>
                </div>
            </div>
            <div className={`p-3 ${show === "rules" ? "" : "hidden"}`}>
                <button className="p-1 border-2 shadow" onClick={() => setShow("main")}>Back</button>
                <h1 className="text-xl font-bold">Rules</h1>
                    <div className="p-2">
                        { data.rules && Object.keys(data.rules).map((rule, index) => (
                            <p className="capitalize mb-2" key={index}>
                            {rule.split("_").join(" ")}: {data.rules[rule].toString()}</p>
                        ))}
                    </div>
            </div>
            <div className={show === "amenities" ? "" : "hidden" }>
                <button className="p-1 border-2 shadow" onClick={() => setShow("main")}>Back</button>
                <h1 className="text-xl font-bold">Amenities</h1>
                    <div className="p-2">
                        { data.amenities.map((amenity, index) => (
                            <p className="capitalize mb-2" key={index}>
                            {amenity.amenity}</p>
                        ))}
                    </div>
            </div>
        </>
    ) )
}

const Modal = ({ handleClick, price }) => {
    const [fromDate, setFromDate] = useState(null);
    const { id } = useParams();
    const handleSetDate = value => {
        (async () => {
            const request = new Request("/reservations")
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
            const body = JSON.stringify({ toDate: value, fromDate, id, price });
            const res = await fetch(request, { method: "POST", headers, body })
            if (res.status >= 200 && res.status <= 400) {
                alert("Request sent!");
            } else {
                alert("Those dates are not available");
            }
        })()
        handleClick();
    };

    return (
        <div onClick={()=> handleClick()} 
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)"}}
            className="transition-opacity
                flex min-w-full min-h-full bg-gray-400 absolute z-1 justify-center items-center"
        >
            <div onClick={e => e.stopPropagation()} className="p-6 absolute w-3/4 h-3/4 border border-black z-20 bg-white opacity-100">
                <h1>Choose the dates of your stay</h1>
                <form className="flex flex-row">
                <div className="w-2/3 mx-auto">
            
            { !fromDate ? <div>
                <h1>Start Date:</h1>
                <Calendar value={fromDate} minDate={new Date()} onChange={value => setFromDate(value)} />
            </div>
            :
            <div>
                <h1>End Date:</h1>
                <Calendar minDate={fromDate} onChange={value => handleSetDate(value)} />
            </div>
            }
        </div>
                </form>
            </div>
        </div>
    )
}
export default Stay