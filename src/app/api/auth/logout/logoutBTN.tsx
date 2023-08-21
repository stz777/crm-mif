"use client"
import logout from "./logoutFn";

export default function LogoutBTN(){
    return <button 
    onClick={logout}
    className="btn btn-sm btn-outline-danger">выйти</button>
}