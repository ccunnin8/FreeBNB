import React, { useState, useEffect } from 'react'

export default function Loading() {
    const [dots, setDot] = useState(".")
    useEffect(() => {
        const interval = setInterval(() => {
            if (dots.length === 3) {
                setDot(".")
            } else {
                setDot(dots + ".");
            }
        }, 500)
        return () => {
            clearInterval(interval);
        }
    })
    return (
        <div>
            Loading{dots}
        </div>
    )
}
