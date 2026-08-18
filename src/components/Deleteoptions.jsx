import { useState } from "react";
import "./styles/deleteoption.css";

export function Deleteiptions(){
    return(
        <div className="deleteoptions-container">

            <div className="checkbutton-container">
                <p>Select All</p>
                <input className="checkboxx" type="checkbox"/>
            </div>


            <div className="buttons-container">
                <button className="delbutton-style" >Delete</button>
                <button className="delbutton-style" >Recycle</button>
            </div>
            
        </div>
        )
}