import React, { createContext, useState } from "react";

export const FormContext = createContext({});

const FormProvider = ({ children}) => {
    const [errors, setErrors] = useState({});
    const [fields, setFields] = useState({});

    const updateFields = (name, val) => {
        setFields({...fields, [name]: val});
    }
    
    const updateErrors = (name, val) => {
        setErrors({...errors, [name]: val})
    }

    const appendToField = (name, val) => {
        setFields({ ...fields, [name]: [...fields[name], val]})
    }
    
    return (
        <FormContext.Provider value={{fields, updateErrors, errors, updateFields, appendToField }}>
            {children}
        </FormContext.Provider>
    )
}

export default FormProvider;