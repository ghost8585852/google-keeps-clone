import React,{useState,useRef} from "react";
import "./styles/note.css";
import "./styles/Background.css";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import PushPinIcon from '@mui/icons-material/PushPin';
import Markdown from "react-markdown";
import {motion ,AnimatePresence} from "framer-motion";
import { backgroundimages } from "./backgroundoptionsgrid";



function Note(props){ 
    const [visibilitycheck, changeVisibility] =useState(false);
    const noteRef = useRef(null);
    const [outerDivHeight, setOuterDivHeight] = useState(null);


   function heightcheck(){
    const height = noteRef.current?.offsetHeight;

    if(height){
        setOuterDivHeight(height);
    }
  
   }
   
    return(
             <AnimatePresence>
                {props.oncheckid === props.id && (
                    <motion.div
                        className="active-note-overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2, ease: "easeOut"}}
                        onClick={(e)=>{e.stopPropagation(); props.divclose()}}
                    />
                )}
                <div style={{height: props.oncheckid === props.id && outerDivHeight ? `${outerDivHeight}px` : undefined , marginBottom: props.oncheckid === props.id ?  "10px": undefined}}>
                <motion.div ref={noteRef} className={props.oncheckid !== props.id ? "notes-container" :"active-note"} 
                layout
                // whileHover={{scale:1.02, duration:0.3}}
                transition={{
                    layout:{
                        type: "tween",
                        duration: 0.55,
                        ease: [0.2, 0, 0, 1]
                    }
                }}
                onMouseEnter={()=>changeVisibility(true)}
                onMouseLeave={()=>changeVisibility(false)}
                id={props.id} onClick={(event) => {  if (props.oncheckid !== props.id) {heightcheck();}; props.divstyle(event);}}
                style={{backgroundColor: props.notebackcolor==="" ? "": props.notebackcolor , border:props.selectState === true ?`2px solid red`:`2px solid rgb(157, 160, 161)` }}>
                    <div className="Note-dark-overlay"></div>
                   {props.selectedimage===null ? "" :<img  className="note-image" fetchPriority="high"  src={backgroundimages[props.selectedimage]} />}
                    <div className="inside-notes-container" id={props.id}>
                        <div className="top" id={props.id}>
                        <h1 className="Note-heading" id={props.id}>{props.title}</h1> 
                        </div>
                        <div className="bottom" style={props.oncheckid === props.id ? {overflowY:"auto"}:{overflow:""}} id={props.id}>
                            <Markdown>
                              { props.activeNote === props.id ?props.message : props.message.slice(0,300)} 
                            </Markdown>
                            
                        </div>
                         <button  className="pin-button" onClick={(e)=>{e.stopPropagation()}}><PushPinIcon /></button>
                    </div>
                    <div className="note-buttons-grid"  id={props.id} style={{opacity:visibilitycheck ? 1 : 0 }} >
                    <button className="Delete-button" id={props.id}  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation();props.onDelete(props.id);props.divclose();}}><DeleteIcon  id={props.id}/></button>
                    <button className="Edit-button"  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation(); props.updatebutton(props.id); }}><EditIcon /></button>
                    <button className="closepreviewpage" onClick={(e)=>{e.stopPropagation(); props.divclose()}} ><CloseIcon id={props.id} /></button>
                     <button className="note-color" id={props.id} style={{display:props.del === true ? "none": "" }}  onClick={(e)=>{e.stopPropagation(); props.colorbarCheck(props.id ,e);}} > < ColorLensIcon  /> </button>

                    </div>
                    <input id={props.id } onChange={props.selectNote} onClick={(e)=>{e.stopPropagation()}} type="checkbox" className="select-div" style={{display: props.show === true ? "" : "none"}} checked={props.selectState || false } />
                    {/* <Backgroundoptions  id={props.id} stateCheck={{display:colorbarnotestate===props.id ? "block" :"none"} } onClick={(e)=>{e.stopPropagation()}} /> */}

                </motion.div></div>
            </AnimatePresence>
    )
}
export default React.memo(Note);
