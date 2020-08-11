import React, { useContext } from "react";

const EmailInput = ({errorClass, context}) => {
    const { errors, updateErrors, updateFields } = useContext(context)
    const { emailError } = errors;
    const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const validateEmail = email => !(regEx.test(email));

    const handleEmailChange = e => {
        const email = e.target.value
        updateErrors("emailError", validateEmail(email));
        updateFields("email", email);
    }
    return (
        <input className={`input ${emailError ? errorClass : ""}`} 
            type="email" name="email" placeholder="Email" onChange={e => handleEmailChange(e)}/>
    )
}

export default EmailInput 