import {useState} from "react";
import "./styles/sidebar.css";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PushPinIcon from '@mui/icons-material/PushPin';
import ArchiveIcon from '@mui/icons-material/Archive';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
 function Sidebar(props){

    const [clickStyle, setClickStyle] = useState(true);
    const [archivestyle, setarchivestyle]= useState(false);
    const [DeleteStyle ,setDeletestyle] = useState(false);



    function MainNotesStyle(){
        setClickStyle(true);
        setarchivestyle(false);
        setDeletestyle(false);
    }

    function ArchiveStyle(){
        setarchivestyle(true);
        setClickStyle(false);
        setDeletestyle(false);
    }

    function DelNotesStyle(){
        setDeletestyle(true);
        setarchivestyle(false);
        setClickStyle(false);
    }
    return(
        <div className="side-bar" style={props.issidebaropen ? {transform:`translateX(0)`,backgroundColor:"#1f1e1e",zIndex:300}:{transform:`translate(-106px)`,zIndex:500}}>
            <ul className="side-bar-listelements">
                <li className="list-contents" style={clickStyle === true ? {backgroundColor:"#9b4a2f",borderRadius:"0px 30px 30px 0px"}: {}} onClick={(e)=>{e.stopPropagation(),props.OpenNotes(); MainNotesStyle(); props.divclose()}} >Notes <LightbulbIcon /></li>
                <li className="list-contents" style={archivestyle === true ? {backgroundColor:"#9b4a2f",borderRadius:"0px 30px 30px 0px"}: {}}  onClick={(e)=>{e.stopPropagation(),ArchiveStyle(); props.OpenArchived(); props.divclose()}}>Archive <ArchiveIcon /></li>
                <li className="list-contents"  style={DeleteStyle === true ? {backgroundColor:"#9b4a2f",borderRadius:"0px 30px 30px 0px"}: {}}  onClick={(e)=>{e.stopPropagation(),props.ShowDeletednotes(); DelNotesStyle(); props.divclose()}}>Bin <AutoDeleteIcon /></li>
            </ul>
        </div>

    )

    
 }
 export default Sidebar;