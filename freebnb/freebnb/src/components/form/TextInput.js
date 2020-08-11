import React, { useContext } from "react";

const TextInput = ({name, placeholder, context, value }) => {
    const { updateFields } = useContext(context);
    const handleChange = e => updateFields(name, e.target.value);
    return (
        <input 
                className="input rounded-b-none" 
                type="text" name={name} id={name} placeholder={placeholder}
                value={value} onChange={e => handleChange(e)} />
    )
}

export default TextInput;