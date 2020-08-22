import React, { useContext } from "react";

const FileInput = ({name, placeholder, context, files, classes=[], extra, accept="image/*", multiple=true }) => {
    const { updateFields } = useContext(context);
    const handleChange = e => updateFields(name, e.target.files[0]) ;
    return (
        <input 
            files={files} 
            type="file" 
            multiple={multiple} 
            accept={accept}
            className={`input rounded-b-none ${classes.join(" ")}`} 
            {...extra}
            name={name} 
            id={name} 
            placeholder={placeholder}
            onChange={e => handleChange(e)} />
    )
}

export default FileInput;