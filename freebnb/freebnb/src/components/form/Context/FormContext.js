import React, { createContext, useState, useReducer } from "react";

export const FormContext = createContext({});

const defaultState = {}

function reducer(state, action) {
    switch (action.type) {
        case "update_field":
            return {
                ...state, 
                [action.key]: action.val 
            }
        case "append_to_field":
            return { 
                ...state,
                [action.key]: [...state[action.key], action.val]
            }
        case "clear_fields":
            return {} 
        default: 
            return state 
    }
}

const FormProvider = ({ children}) => {
    const [errors, setErrors] = useState({});
    const [fields, dispatch] = useReducer(reducer, defaultState);

    const updateFields = (name, val) => {
        dispatch({type: "update_field", key: name, val})
    }
    
    const updateErrors = (name, val) => {
        setErrors({...errors, [name]: val})
    }

    const appendToField = (name, val) => {
        dispatch({ type: "append_to_field", key: name, val })
    }

    const clearFields = () => dispatch({ type: "clear_fields" });
    return (
        <FormContext.Provider value={{fields, updateErrors, errors, updateFields, appendToField, clearFields }}>
            {children}
        </FormContext.Provider>
    )
}

export default FormProvider;