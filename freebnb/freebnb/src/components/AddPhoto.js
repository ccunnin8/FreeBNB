import React, { useState } from 'react'
import { ReactComponent as Photo } from "../assetts/uploadphoto.svg";
import { ReactComponent as Phone } from "../assetts/phone.svg";
import { ReactComponent as Email } from "../assetts/mail.svg";
const Ball = ({active}) => (
    <div className={`rounded-full w-5 h-5 border-gray-800 ${active ? "bg-gray-500" : "bg-gray-200"} shadow`}></div>
)

const Balls = ({page}) => (
    <div className="flex flex-row w-1/4 mx-auto justify-between my-4">
        <Ball active={page === 1}/>
        <Ball active={page === 2}/>
        <Ball active={page === 3}/>
    </div>
)

export const ContinueSignup = () => {
    const [page, setPage] = useState(1)
    const handlePageChange = (num) => {
        setPage(num);
    }

    return (
        <div className="container mx-auto">
            <Balls page={page}/>
            { page === 1 && <AddPhoto next={handlePageChange}/> } 
            { page === 2 && <VerifyPhone next={handlePageChange}/>}
            { page === 3 && <VerifyEmail />}
        </div>
    )
}
export const AddPhoto = ({ next }) => {
    const [image, setImage] = useState("");
    const handleChange = e => {
        console.log(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0])
        reader.addEventListener("load", () => {
            setImage(reader.result);
        }, false);
    };
    return (
        <div className="container mx-auto">
            <form className="flex flex-col items-center ">
                <h1 className="capitalize text-xl text-center">Add a photo</h1>
                {
                    image ? 
                    <>
                    <img style={{width: 200, height: 200}}src={image} alt="potential profile"  /> 
                    <button onClick={() => next(2)}>Next</button>
                    </>:
                    <Photo width={200} height={200} style={{marginRight: 0, marginLeft: 0}} />         
                }
                <input 
                    onChange={e => handleChange(e)}
                    className="hidden" 
                    type="file" 
                    name="photo" 
                    id="photo" accept="image/png, image/jpeg" />
                <label htmlFor="photo" className="btn-big w-64 text-center text-lg hover:shadow-outline">
                    Upload Photo</label>
                <button className="btn-big bg-white text-black w-64 text-lg hover:shadow-outline">Upload From Facebook</button>
                <div className="my-4 w-64">
                    <button onClick={() => next(2)}>Skip for now...</button>
                </div>
            </form>
        </div>
    )
}

export const VerifyPhone = ({next}) => {
    const [tel, setTel ] = useState("");
    const validTel = () => {
        if (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(tel)) {
            return "border-red-600 bg-red-200";
        }
    }
    const handleSetTel = (newTel) => {
        if (newTel.length >= tel.length) {
            switch (newTel.length) {
                case 3:
                case 7:
                    setTel(newTel + "-");
                    break;
                default: 
                    setTel(newTel)
            }
        } else {
            setTel(newTel);
        }
    }
    return (
        <div className="container mx-auto">
            <form className="flex flex-col items-center">
                <h1 className="capitalize text-xl text-center">Verify Phone Number</h1>
                <Phone width={200} height={200} style={{marginRight: 0, marginLeft: 0}} />
                <input 
                        type="tel" 
                        name="cell" 
                        value={tel}
                        onChange={(e) => handleSetTel(e.target.value)}
                        placeholder="XXX-XXX-XXXX"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        maxLength={12}
                        className={`border ${validTel()} w-64 my-4 text-xl text-center`}/>
                <button className="btn-big w-64">Call Me</button>
                <div className="my-4 w-64">
                    <button onClick={() => next(3)}>Skip for now...</button>
                </div>
            </form>
        </div>
    )
}

const VerifyEmail = () => {
    const [email, setEmail] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        alert("Sending email to " + email + ". Please check inbox to confirm.");
    }
    return (
        <div className="container mx-auto">
            <form className="flex flex-col items-center" onSubmit={e => handleSubmit(e)}>
                <h1 className="capitalize text-xl text-center">Verify Email</h1>
                <Email height={200} width={200}/>
                <input 
                    class="input w-64 my-4 text-xl text-center" 
                    type="email" 
                    placeholder="enter email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button className="btn-big w-64 bg-blue-600">Send Confirmation</button>
                <div className="my-4 w-64">
                    <button>Skip for now...</button>
                </div>
            </form>
        </div>
    )
}