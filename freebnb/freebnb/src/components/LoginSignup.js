import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Mail } from "../assetts/mail.svg";
import { ReactComponent as Facebook } from "../assetts/facebook.svg";
import { ReactComponent as Google } from "../assetts/google.svg";
import { ReactComponent as Apple } from "../assetts/apple.svg";
import BirthdayInput from "./form/BirthdayInput";
import EmailInput from "./form/EmailInput";
import TextInput from "./form/TextInput";
import PasswordInput from "./form/PasswordInput";
import FormProvider, { FormContext } from "./form/Context/FormContext";

const LoginMethod = ({name, url, svg}) => (
    // Stateless component that creates a button for user to log in with a certain method 
    <div className="loginButton">
        {svg} <span className="ml-2">{name}</span>
    </div>     
)

export const LoginMethods = ({toggle, setToggle}) => (
    // Creates a list of buttons (ie, facebook, apple, google)
    // hides button if toggle is set to true, which happens if the user clicks the email button
    <div className={`${toggle ? "hidden" : "" }`}>
        <span onClick={() => setToggle(!toggle)}>
            <LoginMethod name="email" svg={<Mail height={20} width={20}/>} url={`email`}/>
        </span>
        <LoginMethod name="facebook" svg={<Facebook />}/>
        <LoginMethod name="google" svg={<Google/>} />   
        <LoginMethod name="apple" svg={<Apple />}/>
    </div>
)
export const LoginSignup = ({type="login", Methods, Form, handleSubmit }) => {
        // container for methods and login or signup form 

        const [toggle, setToggle] = useState(false);

        return (
            <div className="container w-5/6 mx-auto">
                <div className="border p-5 min-h-full  mt-10">
                    <h1 className="capitalize text-xl font-bold text-center mb-5">{type}</h1>
                    <Methods toggle={toggle} setToggle={setToggle} />
                    <Form toggle={toggle} setToggle={setToggle} handleSubmit={(e) => handleSubmit(e)}/>
                </div>
                { type === "login" ? 
                    <p className="mt-5">Not a member? <Link className="text-blue-400" to="/signup">Sign Up</Link></p>
                    :
                    <p className="mt-5">Already a member? <Link className="text-blue-400" to="/login">Login</Link></p>
                }   
            </div>
        )
}
const LoginForm = ({ handleSubmit }) => {
    // form to log in user 
    const { fields, errors } = useContext(FormContext);
    console.log(fields);
   return(
        <form className="flex flex-col" onSubmit={e => handleSubmit(e)}>
            <EmailInput context={FormContext} />
            <PasswordInput 
                    error={errors.passwordError}
                    value={fields.password}
                    exclude={["firstname", "lastname", "email"]} 
                    context={FormContext}
                />
            <button className="btn-big">Log In</button>
        </form>
    )
}
export const LoginEmail = ({toggle, setToggle, handleSubmit}) => (
    // container for login 
    <FormProvider>
        <div className={`${toggle ? "" : "hidden"}`}>
            <LoginForm handleSubmit={handleSubmit} />
            <button onClick={() => setToggle(!toggle)} className="hover:underline hover:text-blue-400 block">Other login options</button>
            <Link className="hover:underline hover:text-blue-400 block" to="/signup">Not a member? Sign Up</Link>
        </div>
    </FormProvider>
)

export const SignupForm = ({handleSubmit}) => {
    // form to sign up users manually 
    const { fields, errors } = useContext(FormContext);
    console.log(fields);
    const disabled = () => {
        if (Object.values(fields).length < 5) return true;
        const fieldsList = Object.values(fields);
        for (let val of fieldsList) {
            if (val === "") return true 
        }
        const errorsList = Object.values(errors);
        for (let err of errorsList) {
            if (err) return true;
        }
        return false
    }
    

    const errorClass = "border-red-400 focus:border-red-400 bg-red-100";
   
    return (
        <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
                <TextInput 
                    value={fields.firstname || ""} name="firstname" placeholder="First name" context={FormContext} />
                <TextInput name="lastname" placeholder="Last name" 
                    value={fields.lastname || ""} context={FormContext}/>
                <p className="mb-5 text-gray-600 text-xs">Make sure it matches the name on your government ID.</p>
                <BirthdayInput errorClass={errorClass} context={FormContext} />
                <EmailInput errorClass={errorClass} context={FormContext} />
                <PasswordInput 
                    error={errors.passwordError}
                    value={fields.password}
                    exclude={["firstname", "lastname", "email"]} 
                    context={FormContext}
                />
                <button disabled={disabled(errors)} className="btn-big">Agree and  Continue</button>
            </form>
    )
}

export const SignupEmail = ({toggle, setToggle, handleSubmit}) => {
    
    return (
        <FormProvider>
            <div className={`${toggle ? "" : "hidden"}`}>
                <SignupForm handleSubmit={handleSubmit} />
                <button onClick={() => setToggle(!toggle)} className="hover:underline hover:text-blue-400 block">Other signup options</button>
                <Link className="hover:underline hover:text-blue-400 block" to="/login">Already a member? Login</Link>
            </div>
        </FormProvider>
    )
}

const handleSignup = (e) => {
    e.preventDefault();
    alert("this was a signup");
}

const handleLogin = (e) => {
    e.preventDefault();
    alert("this was a login");
}

export const Login = () => (
    <LoginSignup type="login" Form={LoginEmail} Methods={LoginMethods} handleSubmit={handleLogin}/>
)

export const Signup = () => (
    <LoginSignup type="signup" Form={SignupEmail} Methods={LoginMethods} handleSubmit={handleSignup} />
)