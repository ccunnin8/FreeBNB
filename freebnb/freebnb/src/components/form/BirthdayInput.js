import React, { useContext } from "react";

export const BirthdayInput = ({ errorClass, context }) => {
    const { updateFields, updateErrors, errors } = useContext(context)
    const { birthdateError } = errors;

    const validateBday = bday => {
        const today = new Date();
        const eighteenYearsAgo = today.getFullYear() - 18;
        const wayTooOld = today.getFullYear() - 120;
        const checkDate = new Date(eighteenYearsAgo, today.getMonth(), today.getDate());
        const ridiculousDate = new Date(wayTooOld, today.getMonth(), today.getDate());
        return !(bday <= checkDate && bday > ridiculousDate);
    }
    const updateBday = e => {
        const bday = new Date(e.target.value);
        updateErrors("birthdateError", validateBday(bday));
        updateFields("birthdate", e.target.value);
    }

    return (
        <>
            <label htmlFor="birthdate" className="text-gray-800">Birthdate: </label>
            <input 
                className={`input ${birthdateError ? errorClass : ""}`} 
                type="date" placeholder="Birthdate" id="birthdate" name="birthdate" 
                onChange={e => updateBday(e) }/>
            <p className="mb-5 text-gray-600 text-xs">To signup, you need to be at least 18. Your birthday won't be shared with others.</p>
        </>
    )
}

export default BirthdayInput;