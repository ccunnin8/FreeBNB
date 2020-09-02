import React, { useEffect, useState } from 'react'
import Nav from './Nav'

export default function Reservations() {
    const [pending, setPending ] = useState([]);
    const [approved, setApproved] = useState([]);
    
    useEffect(() => {
        const request = new Request("/owner_reservations");
        const headers = new Headers();
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`);
        (async () => {
            try {
                const res = await fetch(request, { method: "GET", headers });
                    if (res.status >= 200 && res.status <= 400) {
                        const data = await res.json();
                        console.log(data);
                        if (data.pending && data.approved) {
                            setPending(data.pending);
                            setApproved(data.approved);
                        } else {
                            console.log("an error occurred");
                        }
                    }
                    else {
                        console.log("an error occurred");
                    }
            }
            catch (err) {
                console.log(err)
            }
        })();
    }, [])

    const handleApprove = id => {
        const request = new Request("/approve_reservation");
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `JWT ${window.localStorage.getItem("token")}`)
        const body = JSON.stringify({ id });
        (async () => {
            try {
                const res = await fetch(request, { method: "PATCH", headers, body })
                if (res.status >= 200 && res.status <= 400) {
                    let reservation;
                    const newPending = pending.filter(((res) => {
                        if (res.id === id) reservation = res;
                        return res.id !== id
                    }));
                    setPending(newPending);
                    setApproved([...approved, reservation])
                    const data = await res.json();
                    console.log(data);
                } else {
                    console.log("an error occurred")
                }
            } catch (err) {
                console.log("an error occurred", err);
            }
        })();
    }

    const handleDeny = id => ""
    return (
        <div>
            <Nav />
            <div className="container w-11/12 mx-auto">
                <h1 className="text-center text-2xl">Reservations for Your Listings</h1>
                <h2 className="text-xl">Approved Reservations</h2>
                { approved.length > 0 ? <table className="min-w-full my-4">
                    <thead className="text-left">
                        <tr>
                            <th>Reservation</th>
                            <th>User</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                    { approved.map((res) => (
                            <tr key={res.id}>
                                <td>{res?.listing?.address?.city}, {res?.listing?.address?.state} </td>
                                <td>{res?.user?.first_name}</td>
                                <td>{res?.from_date && new Date(res?.from_date).toLocaleDateString()}</td>
                                <td>{res?.to_date && new Date(res?.to_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> :
                <h2>No approved reservations</h2> 
                }
                <h2 className="text-xl">Pending Reservations</h2>
                { pending.length > 0 ? <table className="min-w-full">
                    <thead className="text-left">
                        <tr>
                            <th>Reservation</th>
                            <th>User</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        { pending.map((res) => (
                            <tr key={res.id}>
                                <td>{res?.listing?.address?.city}, {res?.listing?.address?.state} </td>
                                <td>{res?.user?.first_name}</td>
                                <td>{res?.from_date && new Date(res?.from_date).toLocaleDateString()}</td>
                                <td>{res?.to_date && new Date(res?.to_date).toLocaleDateString()}</td>
                                <td><button onClick={() => handleApprove(res?.id)}
                                    className="border border-red-600 text-red-600 p-1 hover:text-white hover:bg-red-600"
                                >Approve</button></td>
                                <td><button onClick={() => handleDeny(res?.id)}
                                    className="border border-teal-500 p-1 hover:text-white hover:bg-teal-600"
                                >Deny</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table> :
                <h2>No pending reservations</h2>
                }
            </div>
        </div>
    )
}
