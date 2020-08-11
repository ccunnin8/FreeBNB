import React, {useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Nav from './Nav';

const data = [
    { 
        lastMsg: "Thank you for booking!",
        userName: "Rhona M",
        time: "Mon 4:30pm",
        avatar: undefined,
        id: 1 
    },
    { 
        lastMsg: "Hope you liked the place!",
        userName: "Adam G",
        time: "07/01 2:00pm",
        avatar: undefined,
        id: 2
    },

]
export default function Messages() {
    return (
        <>
            <div className="container w-11/12 p-4 mx-auto h-full">
                <Nav />
                <h1 className="text-2xl mb-4">Messages</h1>
                <ConvoPreviews convos={data} />
            </div>
        </>
    )
}


const ConvoPreviews = ({ convos }) => (
    <>
        { convos.map(convo => <Conversation {...convo} key={convo.id} />)}
    </>
)

const Conversation = ({ lastMsg, userName, avatar, time, id }) => (
    <Link to={`/messages/${id}`}>
        <div className="flex flex-row border-2 p-4 mb-5">
            <div className="flex flex-row items-center p-2 mb-4 w-1/2">
                {avatar ? <img src={avatar} alt="user's avatar" /> : 
                <div style={{ height: 30, width: 30}}className="rounded-full bg-red-400 mr-3"></div>
                }
                <h3>{ userName }</h3>
            </div>
            <div className="w-1/2">
                <h1>{lastMsg}</h1>
                <h4>{time}</h4>
            </div>
        </div>
    </Link>
)
const Message = ({ sender, receiver, msg, time }) => (
    <div className={sender === "Corey" ? "text-right" : "text-left"}>
        <p className="text-lg"> {msg} <span className="text-xs">{time}</span></p>
    </div>
)
export const Chat = () => {
    const [msg, setMsg] = useState("");
    const [msgs, setMsgs] = useState([]);
    useEffect(() => {
        setMsgs([
            { id: 1, sender: "Mary", receiver: "Corey", msg: "Hey there", time: "03-14 2pm" },
            { id: 2, sender: "Corey", receiver: "Mary", msg: "Hey!", time: "03-14 3pm"}
        ])
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!msg) return 
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        const minutes = date.getMinutes()
        const timestamp = `${month}-${day} ${hours}:${minutes}`
        e.preventDefault();
        setMsgs([...msgs, {
            id: msgs.length + 1, sender: "Corey", receiver: "Mary", msg, time: timestamp
        }]);
        setMsg("");
    };
    const handleChange = e => setMsg(e.target.value);
    return (
        <div className="container w-5/6 mx-auto p-2 my-5">
            <Nav />
            <Link to="/messages">Back</Link>
            <h1 className="text-3xl mb-2">Messages</h1>
            <div className="border mx-auto w-11/12 p-4 shadow rounded">
                { msgs.map(msg => <Message key={msg.id} {...msg} />)}
            </div>
            <form className="p-4" onSubmit={(e) => handleSubmit(e)}>
                <input 
                    onChange={(e) => handleChange(e) } 
                    type="text" name="message" id="message" value={msg}
                    className="w-5/6 border rounded"
                />
                <button className="border-teal-600 shadow ml-2 bg-teal-300">Submit</button>
            </form>
        </div>
    )
}