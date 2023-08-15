"use client"

import { useState } from "react"

export function Add_Payment() {
    const [isOPen, setIsOpen] = useState(false);
    return <>
        <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => {
                setIsOpen(!isOPen);
            }}>{isOPen ? "свернуть" : "провести оплату"}</button>
    </>
}
