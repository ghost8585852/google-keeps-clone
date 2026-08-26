import {useState} from "react";
import "./styles/sidebar.css";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArchiveIcon from '@mui/icons-material/Archive';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
 function Sidebar(props){

    const [clickStyle, setClickStyle] = useState(true);



    function MainNotesStyle(){
        setClickStyle(true);
    }

    function DelNotesStyle(){
        setClickStyle(false);
    }
    return(
        <div className="side-bar" style={props.issidebaropen ? {transform:`translateX(0)`,backgroundColor:"rgb(59, 59, 59)",zIndex:700}:{transform:`translate(-106px)`,zIndex:500}}>
            {/* <button className="Menu-close-icon" style={{display:props.menuclosebuttoncheck ? "":"none"}} onClick={(e)=>{e.stopPropagation(); props.MenuClose()}}><HighlightOffIcon/></button> */}
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