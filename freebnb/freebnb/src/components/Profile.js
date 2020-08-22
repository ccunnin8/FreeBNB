import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import {UserContext} from "./auth/UserContext";
import TextInput from './form/TextInput';
import TextArea from "./form/TextArea";
import FormProvider, { FormContext } from './form/Context/FormContext';
import { states } from "./form/states_data";
import Select from './form/Select';
import FileInput from './form/FileInput';

const statesData = states.map(state => ({ "value": state.abbreviation, "text": state.abbreviation }))
const roomTypesData = [
    {"value": "P", "text": "Private Room"}, 
    {"value": "W", "text": "Whole Home"}, 
    {"value": "S", "text": "Shared Home"}
]
const Listing = ({ headline, photos, id, handleDelete }) => {
    
    return (
        <div className="flex flex-row items-center w-2/3 h-10 my-4 border-b border-gray-600 pb-3">
            { photos[0] && <img alt="thumbnail" className="w-10 h-10 mr-20 my-4" src={`${photos[0]?.image}`} /> }
            <h2 className="mr-auto">{headline}</h2>
            <button onClick={() => handleDelete(id)} className="border border-black rounded p-1 bg-gray-500">Delete</button>
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
                if (res.status >= 200 && res.status <= 400) {
                    const data = await res.json();
                    setListings(data.listings);
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
                    setReservations(data.reservations); 
                } else {
                    console.log("an error occurred gettign the data");
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
                    { reservations.length === 0 ? <p>No reservations yet</p> : "" }
                </div>
                <div>
                    <h2 className="text-lg">My Listings</h2>
                    { listings.length === 0 ?  <p>No listings yet</p> : 
                       listings.map(listing => <Listing handleDelete={deleteListing} key={listing.id} {...listing} />)
                    }
                </div>
                <h2 className="text-lg">Create a Listing</h2>
                <FormProvider>
                    <NewListing />
                </FormProvider>
            </div>
        </div>
    )
}

const NewListing = () => {
    const { fields } = useContext(FormContext);

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
            console.log(data);
        } else {
            console.log(res, "an error occurred!");
        }
    }

    return (
        <form encType="multipart/form-data" className="flex flex-col min-w-full" onSubmit={e => createNewListing(e)}>
            <div>
                { }
            </div>
            <FileInput context={FormContext} name="photos" files={fields.files || []}/>
            <TextInput classes={["m-0 "]} placeholder="Headline" name="headline" context={FormContext} value={fields.headline || "" }/>
            <label>Description: </label>
            <TextArea classes={["h-32"]}context={FormContext} value={fields.description || ""} name="description" />
            <label>Price per Night:</label>
            <TextInput 
                extra={{ pattern: "[0-9]{2}.[0-9]{2}"}}
                placeholder="Price: $00.00" 
                name="price_per_night" 
                context={FormContext} 
                value={fields.price_per_night || "" } 
            />
            <label>Room Type:</label>
            <Select options={roomTypesData} context={FormContext} name="room_type" defaultVal={{key:"room_type", val: "P"}} />
            <label>Address: </label>
            <TextInput placeholder="123 Main Street" value={fields.street || ""} name="street" context={FormContext} />
            <div>
                <TextInput placeholder="City" value={fields.city || "" } name="city" context={FormContext} />
                <Select name="state" defaultVal={{key: "state", val: "AL"}} options={statesData} context={FormContext} />
            </div>
            <TextInput 
                classes={["w-1/3"]}
                placeholder="Zip" extra={{minLength: "5", maxLength: "5"}} context={FormContext} name="zip_code" 
            />
            <input type="submit" value="Submit" />
        </form>
    )
}
