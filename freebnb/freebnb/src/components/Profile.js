import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import {UserContext} from "./auth/UserContext";
import FormProvider, { FormContext } from './form/Context/FormContext';
import { Link } from "react-router-dom";
import MainListingForm from "./form/MainListingForm";


const Listing = ({ headline, photos, id, handleDelete }) => {
    
    return (
        <div className="flex flex-row items-center w-11/10 h-10 my-4 border-b border-gray-600 pb-3">
            { photos[0] && <img alt="thumbnail" className="w-10 h-10 mr-20 my-4" src={`${photos[0]?.image}`} /> }
            <h2 className="ml-auto mr-auto overflow-hidden">{headline}</h2>
            <Link to={`/stay/${id}/edit`}>
                <button className="flex-shrink-0 w-16 border border-black rounded p-1 bg-gray-500">Edit</button>
            </Link>
            <button onClick={() => handleDelete(id)} className="flex-shrink-0 w-16 border border-black rounded p-1 bg-gray-500">Delete</button>
        </div>
    )
}
export default function Profile() {
    const { userState } = useContext(UserContext);
    const { user } = userState;
    const [reservations, setReservations] = useState([]);
    const [listings, setListings] = useState([]);
   
    const deleteListing = async id => {
        const request = new Request("/listings")
        const headers = new Headers()
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
        const res = await fetch(request, { method: "DELETE", headers, body: JSON.stringify({ id })});
        if (res.status >= 200 && res.status <= 400) {
            setListings(listings.filter(listing => listing.id !== id))
        } else {
            console.log("Error deleting that listing");
        }
    }
    useEffect(() => {
        (async function getListings() {
            const request = new Request("/listings");
            const headers = new Headers();
            headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`)
            try {
                const res = await fetch(request, { method: "GET", headers })
                if (res.status >= 200 && res.status < 400) {
                    const data = await res.json();
                    if (data.status !== "error") {
                        setListings(data.listings);
                    }
                } else {
                    console.log("an error occurred getting the data")
                }
            } catch (err) {
                console.log("server error occurred", err);
            }
        })();

        (async function getReservations() {
            const request = new Request("/reservations");
            const headers = new Headers();
            headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`)
            try {
                const res = await fetch(request, { method: "GET", headers });
                if (res.status >= 200 && res.status <= 400 ){
                    const data = await res.json();
                    if (data.status !== "error") {
                        setReservations(data.reservations); 
                    }
                } else {
                    console.log("an error occurred getting the data");
                }
            } catch (err) {
                console.log("server error occurred", err);
            }
        })()
    }, [])
    return (
        <div>
            <Nav />
            <div className="container w-11/12 p-4 mx-auto h-full">
                <h1 className="text-2xl">Welcome { user.first_name }</h1>
                <div>
                    <h2 className="text-lg">My reservations</h2>
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th>Listing</th>
                                <th>Description</th>
                                <th>Approved</th>
                                <th>From</th>
                                <th>To</th>
                            </tr>
                        </thead>
                        <tbody>
                        { reservations.length > 0 && reservations.map(res => (
                            <Reservation key={res.id} {...res} />
                        )) }
                        </tbody>
                    </table>
                    { reservations.length === 0 && <p>No reservations yet</p>}
                </div>
                <div>
                    <h2 className="text-lg">My Listings</h2>
                    { listings.length === 0 ?  <p>No listings yet</p> : 
                       listings.map(listing => <Listing handleDelete={deleteListing} key={listing.id} {...listing} />)
                    }
                </div>
                    <FormProvider>
                        <NewListing setListings={setListings} listings={listings} />
                    </FormProvider>
                    
            </div>
        </div>
    )
}

const Reservation = ({ to_date, from_date, listing, accepted }) => (
    <tr>
        <td className="flex justify-center items-center">
            <Link to={`/stay/${listing.id}`}>      
            { listing.photos[0] && <img alt="thumbnail" className="w-10 h-10 mr-20 my-4" src={`${listing.photos[0]?.image}`} /> }
            </Link>
        </td>
        <td>
            <h2 className="ml-auto mr-auto overflow-hidden">{listing.headline}</h2>
        </td>
        <td>
            { accepted ? <span className="text-blue-300">Approved</span> : <span className="text-red-600">Awaiting approval</span>}
        </td>
        <td>
            <h2>{from_date && new Date(from_date).toLocaleDateString()}</h2>
        </td>
        <td>
            <h2>{to_date && new Date(to_date).toLocaleDateString()}</h2>
        </td>
    </tr>
)

const NewListing = ({ setListings, listings }) => {
    const { fields, clearFields } = useContext(FormContext);

    const createNewListing = async e => {
        e.preventDefault();
        const request = new Request("/listings");
        const headers = new Headers();
        const formData = new FormData();
        for (let key of Object.keys(fields)) {
            formData.append(key, fields[key]);
        }
        headers.append("Authorization", `JWT ${localStorage.getItem("token")}`)
        const res = await fetch(request, { method: "POST", headers, body: formData });
        if (res.status >= 200 && res.status <= 400) {
            const data = await res.json();
            if (data.status !== "error") {
                setListings([...listings, data.listing]);
                clearFields();
            } else {
                console.log(data);
            }
        } else {
            console.log(res, "an error occurred!");
        }
    }

    return (
        <MainListingForm fields={fields} FormContext={FormContext} handleSubmit={createNewListing}/>
    )
}

