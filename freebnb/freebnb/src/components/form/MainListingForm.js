import React, { useContext } from "react";
import FileInput from "./FileInput";
import TextInput from "./TextInput";
import Select from "./Select";
import TextArea from "./TextArea";
import { states } from "./states_data";

const statesData = states.map(state => ({ "value": state.abbreviation, "text": state.abbreviation }))
const roomTypesData = [
    {"value": "P", "text": "Private Room"}, 
    {"value": "W", "text": "Whole Home"}, 
    {"value": "S", "text": "Shared Home"}
]

const MainListingForm = ({ handleSubmit, FormContext, fields}) => {
    return (
        <form encType="multipart/form-data" className="flex flex-col min-w-full" onSubmit={e => handleSubmit(e)}>
            <FileInput context={FormContext} name="photos" files={fields.files || []}/>
            <TextInput classes={["m-0 "]} placeholder="Headline" name="headline" context={FormContext} value={fields.headline || "" }/>
            <label>Description: </label>
            <TextArea classes={["h-32"]}context={FormContext} value={fields.description || ""} name="description" />
            <label>Price per Night:</label>
            <TextInput 
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
                value={fields.zip_code || ""}
                placeholder="Zip" extra={{minLength: "5", maxLength: "5"}} context={FormContext} name="zip_code" 
            />
            <input type="submit" value="Submit" />
        </form>
    )
}

export default MainListingForm