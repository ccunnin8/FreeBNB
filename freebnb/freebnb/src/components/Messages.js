import React, {useState, useEffect, useContext } from 'react'
import { Link, useParams } from "react-router-dom";
import Nav from './Nav';
import {UserContext} from "./auth/UserContext";
import { v4 as uuid } from "uuid";


export default function Messages() {
    const [ convos, setConvos] = useState(null);
    useEffect(() => {
        const request = new Request("/conversations")
        const headers = new Headers();
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
        (async () => {
            try {
                const res = await fetch(request, { method: "GET", headers });
                if (res.status >= 200 && res.status <= 400) {
                    const data = await res.json(); 
                    if (data.status === "success") {
                        console.log(data);
                        setConvos(data.convos);
                    } else {
                        console.log("error", data);
                    }
                }
            } catch (err) { 
                console.log(err)
            }
        })();
    }, [])
    return (
        <>
            <div className="container w-11/12 p-4 mx-auto h-full">
                <Nav />
                <h1 className="text-2xl mb-4">Messages</h1>
                { convos && <ConvoPreviews convos={convos} />}
            </div>
        </>
    )
}


const ConvoPreviews = ({ convos }) => (
    <>
        { convos.map(convo => <Conversation {...convo} key={convo.id} />)}
    </>
)

const Conversation = ({ messages, sender, receiver, avatar, id }) => {
    const { userState } = useContext(UserContext);

   return (
        <Link to={`/messages/${id}`}>
        <div className="flex flex-row border-2 p-4 mb-5">
            <div className="flex flex-row items-center p-2 mb-4 w-1/2">
                {avatar ? <img src={avatar} alt="user's avatar" /> : 
                <div style={{ height: 30, width: 30}}className="rounded-full bg-red-400 mr-3"></div>
                }
                <h3>{ userState?.user?.username === sender.username ? receiver.first_name : sender.first_name }</h3>
            </div>
            { messages.length > 0 && <div className="w-1/2">
                <h1>{messages[messages.length - 1].message}</h1>
                <h4>{messages[messages.length - 1].time}</h4>
            </div>
            }
        </div>
    </Link>
   )
}
const Message = ({ sender, user, message, time }) => (
    <div className={sender === user ? "text-right" : "text-left"}>
        <p className="text-lg"> {message} <span className="text-xs">{time}</span></p>
    </div>
)

let socket;

export const Chat = () => {
    const [msg, setMsg] = useState("");
    const [msgs, setMsgs] = useState([{message: "testing"}]);
    const { id } = useParams();
    const { userState } = useContext(UserContext);

    const handleReceiveMessage = e => {
        const data = JSON.parse(e.data);
        setMsgs(msgs => [...msgs, data])
    }
    
    useEffect(() => {
        socket = new WebSocket(`ws://localhost:8000/messages/${id}?token=${localStorage.getItem("token")}`);
        socket.onopen = e => console.log("connected", e);
        socket.onerror = e => console.log("error", e);
        socket.onclose = e => console.log("close", e);
        socket.onmessage = e => { handleReceiveMessage(e) } 
        (async () => {
            const request = new Request(`/conversation/${id}`);
            const headers = new Headers()
            headers.append("Authorization", `JWT ${localStorage.getItem("token")}`)
            try {
                const res = await fetch(request, { method: "GET", headers });
                if (res.status >= 200 && res.status <= 400) {
                    const data = await res.json();
                    if (data.status === "success") {
                        setMsgs(() => data.messages)
                    } else {
                        console.log("an error occurred getting the messages")
                    }
                } else {
                    console.log("an error occured getting messages");
                }
            } catch (err) {
                console.log("an error occurred", err)
            }
        })()
        return () => socket.close();
        
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
        socket.send(JSON.stringify({
            message: msg,
            sender: userState.user.username, 
            time: timestamp
        }))
        setMsg("");
    };
    const handleChange = e => setMsg(e.target.value);
    return (
        <div className="container w-5/6 mx-auto p-2 my-5">
            <Nav />
            <Link to="/messages">Back</Link>
            <h1 className="text-3xl mb-2">Messages</h1>
            <div className="border mx-auto w-11/12 p-4 shadow rounded">
                { msgs.map(msg => <Message user={userState?.user?.username} key={msg.id || uuid()} {...msg} />)}
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