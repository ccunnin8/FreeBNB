import React, { useContext } from "react";

const TextArea = ({name, placeholder, context, value, classes=[] }) => {
    const { updateFields } = useContext(context);
    const handleChange = e => updateFields(name, e.target.value);
    return (
        <textarea 
                className={`input rounded-b-none ${classes.join(" ")}`} 
                type="text" name={name} id={name} placeholder={placeholder}
                value={value} onChange={e => handleChange(e)} ></textarea>
    )
}

export default TextArea;