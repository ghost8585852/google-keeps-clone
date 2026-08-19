import React,{useState,useEffect} from "react";
import "./styles/note.css";
import "./styles/Background.css";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import PushPinIcon from '@mui/icons-material/PushPin';
import SaveIcon from '@mui/icons-material/Save';
import {motion ,AnimatePresence} from "framer-motion";



function Note(props){ //note  function 
    const [visibilitycheck, changeVisibility] =useState(false);

        // changeVisibility(true);
        // console.log(visibilitycheck);

    // const [colorbarnotestate,changecolorbarstate]= useState(null);

    // function colorbarCheck(id){
    //     console.log(id);
    //     const visibility=id;
    //     changecolorbarstate(prev => prev===visibility ? null :visibility);
    
    // }


   
    
   
    return(
             <AnimatePresence>
                <motion.div className={props.oncheckid !== props.id ? "notes-container" :"active-note"} 
                layout
                // whileHover={{scale:1.02, duration:0.3}}
                transition={{
                    layout:{duration:0.5,type:"tween",stiffness:20,damping:5}
                }}
                onMouseEnter={()=>changeVisibility(true)}
                onMouseLeave={()=>changeVisibility(false)}
                id={props.id} onClick={props.divstyle}
                style={{backgroundColor: props.notebackcolor==="" ? "": props.notebackcolor , border:props.selectState === true ?`2px solid red`:`2px solid rgb(157, 160, 161)` }}>
                    
                   {props.selectedimage===null ? "" :<img  className="note-image" src={ "/src/assets/images/"+props.selectedimage+".png"} />}
                    <div className="inside-notes-container" id={props.id}>
                        <div className="top" id={props.id}>
                        <h1 className="Note-heading" id={props.id}>{props.title}</h1> 
                        </div>
                        <div className="bottom" id={props.id}>
                            <p id={props.id} >{props.message}</p>
                        </div>
                         <button  className="pin-button" onClick={(e)=>{e.stopPropagation()}}><PushPinIcon /></button>
                    </div>
                    <div className="note-buttons-grid"  id={props.id} style={{opacity:visibilitycheck ? 1 : 0 }} >
                    <button className="Delete-button" id={props.id}  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation();props.onDelete(props.id);props.divclose();}}><DeleteIcon  id={props.id}/></button>
                    <button className="Edit-button"  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation(); props.updatebutton(props.id); }}><EditIcon /></button>
                    <button className="closepreviewpage" onClick={(e)=>{e.stopPropagation(); props.divclose()}} ><CloseIcon id={props.id} /></button>
                     <button className="note-color" id={props.id} style={{display:props.del === true ? "none": "" }}  onClick={(e)=>{e.stopPropagation(); props.colorbarCheck(props.id ,e);}} > < ColorLensIcon  /> </button>

                    </div>
                    <input id={props.id } onChange={props.selectNote} onClick={(e)=>{e.stopPropagation()}} type="checkbox" className="select-div" style={{display: props.show === true ? "" : "none"}} />
                    {/* <Backgroundoptions  id={props.id} stateCheck={{display:colorbarnotestate===props.id ? "block" :"none"} } onClick={(e)=>{e.stopPropagation()}} /> */}

                </motion.div>
            </AnimatePresence>
    )
}
export default Note;