import { useState } from "react";
import "./styles/checker.css";
export function Decision(props){
    return(

        <div className="decision-overlay" style={{display:props.checkerState ? undefined : "none"}}>
        <div className="decision-container" >
            <p className="decision-text">{props.checkermessage}</p>
            <div className="decision-button-container">
                <button className="decision-button-style" onClick={(e)=>{e.stopPropagation();props.finalcheck(true)}}>Yes</button>
                <button className="decision-button-style" onClick={(e)=>{e.stopPropagation();props.finalcheck(false)}}>No</button>
            </div>
        </div>
        </div>
    );
}
