import React,{useEffect, useRef,useState} from "react";
import "./styles/note.css";
import "./styles/Background.css";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import Markdown from "react-markdown";
import {motion, AnimatePresence} from "framer-motion";
import { backgroundimages } from "./backgroundoptionsgrid";
import UnarchiveIcon from '@mui/icons-material/Unarchive';

function PinIcon({ pinned }) {
    return (
        <svg
            className="pin-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            {pinned ? (
                <path fill="currentColor" d="M16 9V4l1-1V2H7v1l1 1v5l-2 2v2h5v8h2v-8h5v-2l-2-2Z" />
            ) : (
                <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 9V4l1-1V2H7v1l1 1v5l-2 2v2h5v8h2v-8h5v-2l-2-2Z"
                />
            )}
        </svg>
    );
}



function Note(props){ 
    const noteRef = useRef(null);
    const [outerDivHeight, setOuterDivHeight] = useState(null);
    const [visibilitycheck, changeVisibility] = useState(false);
    const isActive = props.oncheckid === props.id;

    const [isSmallScreen , setIsSmallScreen] = useState(
        window.innerWidth <700 
    );

    useEffect(()=>{

        function checkScreenSize() {
            setIsSmallScreen(window.innerWidth < 700);
        }

        window.addEventListener("resize", checkScreenSize);

        return ()=>{
            window.removeEventListener("resize", checkScreenSize);
        }

    },[]);


   function heightcheck(){
    const height = noteRef.current?.offsetHeight;

    if(height){
        setOuterDivHeight(height);
    }
  
   }

    return(
             <>
                <AnimatePresence>
                 {props.oncheckid === props.id && (
                    <motion.div
                        key={`overlay-${props.id}`}
                        className="active-note-overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 1, ease:[0.2, 0, 0, 1]}}
                        onClick={(event)=>{event.stopPropagation(); props.divclose()}}
                    />
                )}
                </AnimatePresence>
                {isActive && (
                    <button
                        type="button"
                        className="active-note-close"
                        aria-label="Close note"
                        onClick={(event) => {
                            event.stopPropagation();
                            props.divclose();
                        }}
                    >
                        <CloseIcon />
                    </button>
                )}
                <div
                 style={{height: props.oncheckid === props.id && outerDivHeight ? `${outerDivHeight}px` : undefined , marginBottom: props.oncheckid === props.id ?  "15px": undefined}}
                >
                <motion.div ref={noteRef} className={props.oncheckid !== props.id ? "notes-container" : "active-note"}
                
                layout = {!isSmallScreen}
                transition={{
                    layout:{
                        type: "tween",
                        duration: 0.11,
                        ease: [0.2, 0, 0, 1]
                    }
                }}
               
                
                onMouseEnter={() => changeVisibility(true)}
                onMouseLeave={() => changeVisibility(false)} 
                
                id={props.id} onClick={(event) => {
                    if (!isActive) {
                        heightcheck();
                        props.divstyle(event);
                    }
                }}
                style={{backgroundColor: props.notebackcolor==="" ? "": props.notebackcolor , border:props.selectState === true ?`1px solid red`:`1px solid rgba(252, 252, 252, 0.02)` }}>
                    <div className="note-visual-content">
                    {props.selectedimage===null ? "" :<img  className="note-image" fetchPriority="high"  src={backgroundimages[props.selectedimage]} />}
                    <div className="inside-notes-container" id={props.id}>
                        <div className="top" id={props.id}>
                        <h1 className="Note-heading" id={props.id}>{props.title}</h1> 
                        </div>
                        <div className="bottom" style={props.oncheckid === props.id ? {overflowY:"auto"}:{overflow:""}} id={props.id}>
                            <Markdown>
                              {props.activeNote === props.id ? props.message : props.message.slice(0,300)} 
                            </Markdown>
                            
                        </div>
                         <button
                            className="pin-button"
                            aria-label={props.ispinned ? "Unpin note" : "Pin note"}
                            onClick={(e)=>{e.stopPropagation() ; props.pin(props.id)}}
                            style={{display:props.DeletedState ? "none":""}}
                         >
                            <PinIcon pinned={props.ispinned} />
                         </button>
                    </div>
                    <div className="note-buttons-grid" id={props.id} style={{opacity: isActive || visibilitycheck ? 1 : 0}}>
                    <button className="Delete-button button-style" id={props.id}  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation();props.onDelete(props.id);props.divclose();}}><DeleteIcon  id={props.id}/></button>
                    <button className="Edit-button button-style"  style={{display:props.del === true ? "none": "" }} onClick={(e)=>{e.stopPropagation(); props.updatebutton(props.id); }}><EditIcon /></button>
                    <button className="note-color button-style" id={props.id} style={{display:props.del === true ? "none": "" }}  onClick={(e)=>{e.stopPropagation(); props.colorbarCheck(props.id ,e);}} > < ColorLensIcon  /> </button>
                    <button className="achieve button-style" id={props.id} onClick={(e)=>{e.stopPropagation(); props.archive(props.id)}}>{props.archived ?<UnarchiveIcon/>:<ArchiveIcon/> }</button>
                    {isActive && (
                        <button
                            className="closepreviewpage button-style mobile-note-close"
                            onClick={(event) => {
                                event.stopPropagation();
                                props.divclose();
                            }}
                        >
                            <CloseIcon />
                        </button>
                    )}
                    </div>
                    </div>
                    <input id={props.id } onChange={props.selectNote} onClick={(e)=>{e.stopPropagation()}} type="checkbox" className="select-div" style={{display: props.show === true ? "" : "none"}} checked={props.selectState || false } />
                    {/* <Backgroundoptions  id={props.id} stateCheck={{display:colorbarnotestate===props.id ? "block" :"none"} } onClick={(e)=>{e.stopPropagation()}} /> */}

                </motion.div></div>
            </>
    )
}
export default React.memo(Note);
