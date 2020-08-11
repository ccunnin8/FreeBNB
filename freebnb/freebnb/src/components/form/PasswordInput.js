
import React, { useContext } from "react";

const PasswordInput = ({error=true, value="", context, exclude=[], errorClass }) => {
    const { updateFields, updateErrors, fields } = useContext(context);
    
    const checkMark = <span className="text-green-400">&#x2713;</span>;
    const redX = <span className="text-red-400">&#x10102;</span>;
    const regEx = /[0-9-!#@$%^&*()_+|~=`{}[\]:";'<>?,./]/;

    const excludes = password => {
        // loop through exclude list and see if the password contains any 
        for (let name of exclude) {
            if (password.includes(fields[name])) {
                return true;
            }
        }
        return false;
    }

    const symbol = password => !(regEx).test(password);

    const length = password => password.length < 8;

    const validatePassword = password =>  excludes(password) || symbol(password) || length(password);

    const handlePasswordChange = password => {
        const errors = validatePassword(password);
        updateFields("password", password);
        updateErrors("passwordError", errors);
    }
 
    return (
        <>
        <input 
            onChange={e => handlePasswordChange(e.target.value) } 
            className={`mt-5 mb-2 input ${error ? errorClass : ""}`}
            value={value}
            type="password" name="password" placeholder="Password" 
        />
        <div className="text-xs ml-2">
            <p>{error ? redX : checkMark} Password strength: 
                <span className={`uppercase ${error ? "text-red-500" : "text-green-500"}`}>{
                    `${error ? " bad" : " good" }`
                }</span></p>
            <p>{excludes(value) ? redX : checkMark} Can't contain your name or email address</p>
            <p>{length(value) ? redX : checkMark} At least 8 characters</p>
            <p>{symbol(value) ? redX : checkMark} Contains a number or symbol</p>
        </div>
        </>
    )
}

export default PasswordInput;