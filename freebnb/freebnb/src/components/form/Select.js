import React, { useContext, useEffect } from "react";

const Select = ({name, placeholder, context, value, classes=[], options, defaultVal }) => {
    const { updateFields } = useContext(context);

    useEffect(() => {
        updateFields(defaultVal.key, defaultVal.val);
    }, []);

    const handleChange = e => updateFields(name, e.target.value);
    return (
        <select 
            className={`input rounded-b-none ${classes.join(" ")}`} 
            type="text" name={name} id={name} placeholder={placeholder}
            onChange={e => handleChange(e)} value={value}>
            { options.map((option,index)  => <option key={`${option}${index}`} value={option.value}>{option.text}</option>)}
        </select>
    )
}

export default Select;