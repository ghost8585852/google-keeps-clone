import {useState} from "react";
import "./styles/sidebar.css";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArchiveIcon from '@mui/icons-material/Archive';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
 function Sidebar(props){

    const [clickStyle, setClickStyle] = useState(true);



    function MainNotesStyle(){
        setClickStyle(true);
    }

    function DelNotesStyle(){
        setClickStyle(false);
    }
    return(
        <div className="side-bar">
            <ul className="side-bar-listelements">
                <li className="list-contents" style={clickStyle === true ? {backgroundColor:"#F59272",borderRadius:"0px 30px 30px 0px"}: {}} onClick={(e)=>{e.stopPropagation(),props.OpenNotes(), MainNotesStyle()}} >Notes <LightbulbIcon /></li>
                <li className="list-contents" >Pins  <PushPinIcon /></li>
                <li className="list-contents" >Archive <ArchiveIcon /></li>
                <li className="list-contents"  style={clickStyle === false ? {backgroundColor:"#F59272",borderRadius:"0px 30px 30px 0px"}: {}}  onClick={(e)=>{e.stopPropagation(),props.ShowDeletednotes(), DelNotesStyle()}}>Bin <AutoDeleteIcon /></li>
            </ul>

        </div>

    )

    
 }
 export default Sidebar;