import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import DefaultStay from "../assetts/defaultStay1.webp";
import { Map, TileLayer } from "react-leaflet";
import "../../node_modules/leaflet/dist/leaflet.css";

const staysData = {
    1: {
        superhost: true,
        type: "private room",
        title: "2 GLAMOROUS GRAD AND MED STUDENT HOUSING",
        price: 15,
        img: DefaultStay,
        city: "baltimore",
        state: "md",
        country: "United States",
        lat: 39.3,
        long: -76.6,
        host: "Scott",
        rating: 4.54,
        id: 1, 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In enim ante, malesuada ut tincidunt vitae, tempus nec nulla. Fusce in vehicula arcu. In in cursus felis, at scelerisque justo. Nullam lectus neque, consectetur non mi ac, commodo pharetra dolor. Mauris a nisl luctus, porta nulla sed, mollis lectus. Maecenas imperdiet urna et lobortis interdum. Donec lobortis mi sit amet nisl sodales, quis pharetra nisl dignissim. Maecenas egestas magna eget bibendum mattis. Nam erat turpis, ornare quis tortor vitae, molestie pellentesque orci. Integer rhoncus nulla sem, non rutrum enim feugiat quis. Donec eu nisl magna.",
        space: "High ceilings, large window and fire mantle. The queen bed is comfy. It’s quiet and good for snoozing. Perfect, clean, budget accommodation for tourists, visitors or business travelers. Room has private bathroom.",
        access: "The room and kitchen",
        other: "Check in after 4pm. Check out 10am",
        rooms: [
            { id: 1, bed: "queen" },
            { id: 2, bed: "twin" }
        ],
        user: "scott",
        bathrooms: 1,
        reviews: [
            {   
                id: 1,
                user: "Anthony",
                review: "Scotty is so warm and welcoming and you just understand each other on a whole new level!",
            },
            {
                id: 2,
                user: "Angelica",
                review: "Este lugar es súper cool, bien ubicado, cerca a todo que hay en baltimore"
            }
        ],
        amenities: ["Wifi", "Cable TV", "Laptop-friendly workspace", "Iron", "Hangers"],
        loc_desc: "Very close to downtown, metro, coffeeshops and all the tourist things",
        rules: {
            "check_in": "4pm",
            "check_out": "10am",
            "key": "self",
            "smoking": "no",
            "pets": "no",
            "parties": "no",
            "additional": ["clean up before leaving"]
        }
    }
}

const Review = ({ user, review }) => (
    <div className="py-3">
        <div className="flex flex-row items-center mb-2" style={{ width: "20%"}}>
            <div className="rounded-full bg-red-300 mr-auto" style={{height: 20, width: 20}}></div>
            <h2>{user}</h2>
        </div>
        <p>{review}</p>
    </div>
)
const Loading = () => {
    const [dots, setDots] = useState(1)

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots === 3 ? 1 : dots + 1)
        }, 500)
        return () => {
            clearInterval(interval)
        }
    }, [dots])
    let dotsString = ""
    for (let i = 0; i  < dots; i++ ){
        dotsString += "."
    }
    return <h1>Loading{dotsString}</h1>
}
const Stay = () => {
    const [data, setData] = useState({})
    const [show, setShow] = useState("main")
    const { id } = useParams();

    useEffect(() => {
        try {
            setData(staysData[id])  
        } catch {
             console.log("There was an error");
        }
    }, [])
    const pluralize = (arr) => {
        if (Array.isArray(arr)) {
            return arr.length > 1 ? "s" : ""
        } else if (Number.isInteger(arr)) {
            return arr > 1 ? "s" : ""
        }
    }
    
    return ( Object.keys(data).length === 0 ? <Loading /> : (
        <>
            <div className={show === "main" ? "" : "hidden" }>
                <nav className="w-full h-20 w-11/12">
                    <ul className="mx-auto flex flex-row py-6 w-11/12">
                        <li className="mr-auto">Back</li>
                        <li>Share</li>
                        <li className="ml-2">Save</li>
                    </ul>
                </nav>
                <section>
                    <img className="w-full mb-10" style={{height: 400}}  src={data.img} alt="where you could be staying" />
                </section>
                <div className="w-11/12 mx-auto">
                    <section className="border-b-2 pb-3">
                        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
                        <h3>
                            <span className="text-red-700">&#9733;</span> 
                            {data.rating}({data.reviews.length}) · <span className="capitalize">{data.city}</span> <span className="uppercase">{data.state}</span>, {data.country}
                        </h3>
                    </section>
                    <section className="flex flex-row border-b-2 my-2 pb-3">
                            <div className="mr-auto">
                                <h2 className="capitalize my-2 font-bold">{data.type}</h2>
                                <h2 className="font-bold">hosted by <span className="capitalize my-2">{data.user}</span></h2>
                                <ul className="mt-3 flex flex-row w-full">
                                    <li className="mx-2">
                                    {data.rooms.length} bedroom{pluralize(data.rooms)} 
                                    </li>
                                    <li className="mx-2">
                                    {data.bathrooms} bathroom{pluralize(data.bathrooms)}
                                    </li>
                                    <li className="mx-2">
                                    {data.rooms.reduce((prev, cur) => cur.bed ? prev + 1 : 0, 0)} bed{pluralize(data.rooms.map(x => x.bed))}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div className="m-3 rounded-full bg-red-700" style={{width: 30, height: 30}}></div> 
                            </div>
                    </section>
                    <section className="border-b-2 my-4 pb-2">
                        <h1 className="text-lg font-bold">Amenities</h1>
                        <ul>
                            { data.amenities.map(a => <li key={Math.random() * 10 + 1} className="my-4">{a}</li>)}
                        </ul>
                        <button onClick={() => setShow("amenities")}
                                className="border-2 rounded shadow p-2 mx-auto w-11/12">Show all amenities</button>
                    </section>
                    <section className="border-b-2 pb-4 mb-2">
                        <h1 className="text-lg font-bold mb-3">Location</h1>
                    { (data.lat && data.long ) && (
                            <Map center={[data.lat, data.long]} zoom={13}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                                />
                            </Map>
                    )}
                    </section>
                    <section className="border-b-2 pb-3">
                        <h1 className="text-lg font-bold mb-3">
                            <span className="text-red-600">
                                &#9733;</span> { data.rating } ({ data.reviews.length })
                        </h1>
                        { data.reviews.map( review => <Review key={review.id} {...review } />)}
                    </section>
                    <section className="py-2 w-min-full">
                        <h1 className="text-xl font-bold">Rules</h1>
                        <div>
                            { Object.keys(data.rules).splice(0, 3).map((rule, index) => (
                                <p className="capitalize mb-2" key={index}>
                                {rule.split("_").join(" ")}: {data.rules[rule]}</p>
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
                        { Object.keys(data.rules).map((rule, index) => (
                            <p className="capitalize mb-2" key={index}>
                            {rule.split("_").join(" ")}: {data.rules[rule]}</p>
                        ))}
                    </div>
            </div>
            <div className={show === "amenities" ? "" : "hidden" }>
                <button className="p-1 border-2 shadow" onClick={() => setShow("main")}>Back</button>
                <h1 className="text-xl font-bold">Amenities</h1>
                    <div className="p-2">
                        { data.amenities.map((amenity, index) => (
                            <p className="capitalize mb-2" key={index}>
                            {amenity}</p>
                        ))}
                    </div>
            </div>
        </>
    ) )
}

export default Stay