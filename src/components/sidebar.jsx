import React,{useState} from "react";
import "./styles/sidebar.css";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArchiveIcon from '@mui/icons-material/Archive';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
 function Sidebar(){
    return(
        <div className="side-bar">
            <ul className="side-bar-listelements">
                <li className="list-contents" >Notes <LightbulbIcon /></li>
                <li className="list-contents" >Pins  <PushPinIcon /></li>
                <li className="list-contents" >Archive <ArchiveIcon /></li>
                <li className="list-contents" >Bin <AutoDeleteIcon /></li>
            </ul>

        </div>

    )

    
 }
 export default Sidebar;