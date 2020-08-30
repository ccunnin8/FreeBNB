import React, { useContext, useState, useEffect  } from "react";
import { useParams, useHistory } from "react-router-dom";
import MainListingForm from "./form/MainListingForm";
import {FormContext} from "./form/Context/FormContext";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const EditListing = () => {
    const { id } = useParams();
    const [ show, setShow ] = useState("main");
    const [ data, setData] = useState({});
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
                    console.log(data);
                } else {
                    console.log("an error occurred getting the data");
                }
            } catch (err) {
                console.log("There was an error ", err);
            }
        })();
    }, [])
   
    return (
    <>
        <button><Link to="/profile">Back</Link></button>
        <h2 className="text-lg">Update Listing</h2>
        <nav>
            <ul className="flex flex-row w-1/2 mx-auto justify-between">
                <li><button onClick={() => setShow("main")}>Main Details</button></li>
                <li><button onClick={() => setShow("amenities")}>Amenities</button></li>
                <li><button onClick={() => setShow("rules")}>Rules</button></li>
            </ul>
        </nav>
            { (() => {
                switch (show) {
                    case "main":
                        return <UpdateDetails data={data}/>
                    case "amenities":
                        return <UpdateAmentities id={data.id} data={data.amenities}/>
                    case "rules":
                        return <UpdateRules id={data.id} rules={data.rules} />
                    default:
                        return <UpdateDetails />
                }
            })()}
    </> )
}

const UpdateDetails = ({ data }) => {
    const { fields, updateFields } = useContext(FormContext);
    const history = useHistory();

    useEffect(() => {
        const formFields = ["headline", "description", "room_type", "price_per_night"]
        for (let field of formFields) {
            console.log(field, data[field]);
            updateFields(field, data[field])
        }
        if (data.address) {
            const addressFields = ["street", "city", "state", "zip_code"]
            for (let field of addressFields) {
                updateFields(field, data?.address[field])
            }
        }
    }, [data])

    const updateForm = (e) => {
        e.preventDefault();
        const request = new Request(`/listing/${data.id}/update`)
        const headers = new Headers()
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
        (async () => {
            const formData = new FormData();
            for (let key of Object.keys(fields)) {
                formData.append(key, fields[key]);
            }
            const res = await fetch(request, { method: "PUT", headers, body: formData })
            if (res.status >= 200 && res.status <= 400) {
                history.push("/profile");
            } else {
                alert("an error occurred updating this listing!");
            }
        })();
    }

    return (
        <>
            <h1>Update Main Details</h1>
            <MainListingForm fields={fields} FormContext={FormContext} handleSubmit={updateForm} />
        </>
    )
}



const UpdateRules = ({rules, id}) => {
    const [data, setRules] = useState(rules);
    const history = useHistory();

    const updateRules = e => {
        e.preventDefault();
        (async () => {
            const request = new Request("/updateRules");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
            const body = JSON.stringify({...data, listing: id})
            const res = await fetch(request, { method: "POST", headers, body});
            if (res.status >= 200 && res.status <= 400) {
                history.push("/profile");
            } else {
                console.log("an error occurred update rules");
            }
        })();
    };

    const handleChange = (name, val) => {
        setRules({...data, [name]: val})
    }
    
    return (
        <>
        <h1>Update Rules</h1>
            <form onSubmit={(e) => updateRules(e)} className="flex flex-col w-2/3 mx-auto">
                <div>
                    <input onChange={e => handleChange(e.target.name, e.target.checked)} 
                        type="checkbox" 
                        name="smoking"
                        checked={data?.smoking}/>
                    <label htmlFor="smoking">Smoking</label>
                </div>
                <div>
                    <input 
                        onChange={e=> handleChange(e.target.name, e.target.checked)} 
                        type="checkbox" 
                        name="pets" 
                    checked={data?.pets} />
                    <label htmlFor="pets">Pets</label>
                </div>
                <div>
                    <input onChange = {e => handleChange(e.target.name, e.target.checked) }
                    type="checkbox" 
                    name="parties" 
                    checked={data?.parties} 
                    />
                    <label htmlFor="parties">Parties</label>
                </div>
                <div className="flex">
                    <label className="w-14" htmlFor="check_in">Check In: </label>
                    <input 
                        maxLength="2" 
                        max={12}
                        min={1} 
                        className="border border-black ml-auto" 
                        type="number" 
                        name="check_in" 
                        value={data?.check_in} 
                        onChange={e => handleChange("check_in", e.target.value)}
                    />
                </div>
                <div className="flex mt-3">
                    <label className="w-14" htmlFor="check_out">Check Out: </label>
                    <input 
                        maxLength="2"
                        max={12} 
                        min={1}
                        className="border border-black ml-auto" 
                        type="number" 
                        name="check_out" 
                        value={data?.check_out} 
                        onChange={e => handleChange("check_out", e.target.value)}
                    />
                </div>
                <label htmlFor="additional">Additional Rules</label>
                <textarea className="border border-black" onChange={e => handleChange("additional", e.target.value)}  name="additional" value={data?.additional} />
                <input className="mt-3" type="submit" value="Update Rules" />
            </form>
        </>
    )
}

const UpdateAmentities = ({data, id}) => {
    const [allAmenities, setAllAmenities] = useState([]);
    const [loading, setLoading ] = useState(true);
    const history = useHistory();

    const submitForm = e => {
        e.preventDefault();
        const request = new Request("/updateAmenities")
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
        console.log(allAmenities);
        const body = JSON.stringify({amenities: allAmenities, id });
        (async () => {
            const res = await fetch(request, { method: "PUT", headers, body });
            if (res.status >= 200 && res.status <= 400) {
                history.push("/profile");
            } else {
                console.log("an error occurred");
            }
        })()
    }

    useEffect(() => {
        const request = new Request("/amenities");
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        (async () => {
            const res = await fetch(request, { method: "GET", headers });
            if (res.status >= 200 && res.status <= 400) {
                const json = await res.json();
                const amenities = json.map(a => ({ id: a.id, amenity: a.amenity, checked: false}))
                for (let amenity of data) {
                    amenities.map((a) => {
                        if (a.amenity === amenity.amenity) {
                            a.checked = true;
                        }
                        return a;
                    })
                }
                setAllAmenities(amenities);
                setLoading(false);
            } else {
                console.log("ERROR");
            }
        })();
    }, [])

    const handleAmenityChange = (val) => {
        const newAmenities = allAmenities.map(a => {
            if (a.amenity === val) {
                a.checked = !a.checked;
            }
            return a;
        })
        setAllAmenities(newAmenities);
    }
    return (
        loading ? <Loading /> : 
            <form className="w-2/3 mx-auto" onSubmit={e => submitForm(e)}>
                <h1 className="text-3xl">Amenities</h1>
                { allAmenities.map(a => 
                    <div key={a.id}>
                        <input 
                            checked={a.checked} 
                            type="checkbox" 
                            name={a.amenity} 
                            id={a.amenity} 
                            onChange={e => handleAmenityChange(e.target.name, e.target.checked)}
                        />
                        <label className="capitalize ml-2 font-semibold my-2" htmlFor={a.amenity}>{a.amenity}</label>
                    </div>
                )}
                <input type="submit" value="Update Amenitites"/>
            </form>
    )
}

export default EditListing