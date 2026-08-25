import "./styles/nav.css";
import { useState } from "react";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ReplayIcon from '@mui/icons-material/Replay';
import { OrbitProgress } from "react-loading-indicators";
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/images/logo.webp";

function Nav(props){

      const [syncState, setSyncState] = useState("idle");

    const handleSync = (e) => {
        e.stopPropagation();

        if (syncState === "loading") return;

        setSyncState("loading");

        props.RunSync();

        // Orbit for 5 seconds
        setTimeout(() => {

            setSyncState("done");

            // Cloud for 3 seconds
            setTimeout(() => {
                setSyncState("idle");
            }, 3000);

        }, 5000);
    };
    return(
        
            <div className="nav-container">
            <button className="menu-icon" name="menu-button" onClick={(e)=>{e.stopPropagation(); props.MenuOpen()}}><MenuIcon/></button>
            <img className="app-logo" src={logo}/>
            <div className="right-side-navcontent-container">
                <button name="sync-button" className="SyncButton" onClick={handleSync}>

                     {syncState === "idle" && (
                        <ReplayIcon className="icon" />
                    )}

                    {syncState === "loading" && (
                        <OrbitProgress className="loader" variant="dotted" color="#fdfdfd" size="small" text="" textColor="" />
                    )}

                    {syncState === "done" && (
                        <CloudDoneIcon className="icon" />
                    )}
                    
                    
                
                </button>
            </div>
            </div>
    )
}
export default Nav;