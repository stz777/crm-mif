"use client"
export default function Client() {
    return <>
        <button onClick={sendMessage}>sendMessage</button>
    </>
}

function sendMessage() {
    const url = `/api/bugReport`

    fetch(
        url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: "manamana",
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            console.log(x);
        })
}
