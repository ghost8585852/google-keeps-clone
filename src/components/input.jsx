import {useState,useEffect} from "react";
import "./styles/input.css"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ImageIcon from '@mui/icons-material/Image';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'; 
import {useEditor,EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "./toolbar";

function InputDiv(props){

    const [inputhead, newinput]=useState({
        title:"",
        content:"",
        image:null,
        backgroundColor:"",
        isdeleted:false,
        isselected:false
    });

    useEffect(()=>{
        if(props.bcolor ){
            newinput((previous)=>({ ...previous,backgroundColor:props.bcolor}));
        }
    },[props.bcolor]);

    useEffect(()=>{
        if(props.bimage==="null"){
            newinput(previous=>({...previous,image:null}))
        }
        else{
            newinput((previous)=>({...previous ,image:props.bimage}))
        }
    },[props.bimage]);


// console.log(inputhead);

    function inputcheck(event){// function to update the values of inputhead
        const{name,value}=event.target; //using input value and gaven name of the input to update inputhead
        newinput((previous)=>({
            ...previous,
            [name]:value,

        }));
        
    }
    // console.log(inputhead);

    function add(){
        if(inputhead.title=="" || inputhead.content==""){
                    return;
                }
                else{
                 props.onAdd(inputhead);

                 newinput({
                    title:"",
                    content:"",
                    image:null,
                    backgroundColor:"",
                    isdeleted:false,
                    isselected:false
                 });

                 editor?.commands.clearContent();

                 }
    }
    const [clicktracker,newvalue]=useState(false);

    function divclicktracker(){
        
        newvalue((previous)=>{
            return !previous;
        });
        // console.log(clicktracker);
        // console.log("pressed");
    }
    function noteclose(){
        newvalue((previous)=>{
            return false;
        })
    }

    // const [palletState,changeState]=useState(false); //I was using this before when i was passing one  the color pallet to each  note . now i'm using only one color palleton the main app.jsx and chaning its position based on  button click. it's much cleaner way to do it .

    // function PalletCheck(event){
        
    //     changeState((previous)=>{
    //         return !previous;
    //     });
        // console.log(palletState);
    // }

const editor = useEditor({
    extensions: [
        StarterKit,
        Markdown,
         Placeholder.configure({
            placeholder: "Content ...",
        }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
        newinput(previous => ({
            ...previous,
            content: editor.getMarkdown()
        }));
    },
});




    return(
        <>
        <div className="inputDiv-container" style={{display: clicktracker ? " " :"none",backgroundColor:inputhead.backgroundColor===" " ? "" : inputhead.backgroundColor}}>
            <h1 className="inputheading">Add note</h1>
            <input name="title" value={inputhead.title} className="add-input title-div" onChange={inputcheck} placeholder="Title"></input>
            {/* <textarea name="content"  value={inputhead.content} className="add-input content-div" onChange={inputcheck} placeholder="Content ..."></textarea> */}

            <EditorContent  className="add-input content-div" editor={editor}/>

            <Toolbar 
            className="editor-toolbar"
            editor={editor}
            style={props.tool === true ? {display:""}:{display:"none"}} />

            <div className="input-screen-buttons ">
                <button className="All-input-buttons-style input-a" id={props.id} onClick={(e)=>{e.stopPropagation(); props.colorbarOpener(props.id,e)}}><ColorLensIcon className="buttons-image-size-input-container"/></button>
                <button className="All-input-buttons-style" onClick={(e)=>{e.stopPropagation(); props.opentoolbar()}}><FormatColorTextIcon className="buttons-image-size-input-container"/></button>
                <button className="All-input-buttons-style input-b"><ImageIcon  className="buttons-image-size-input-container"/></button>
               
            </div>
            {/* <Backgroundoptions stateCheck={{display: palletState===true ? "" :"none"}} /> */}
            <button className="add-button" 
            onClick={add}><AddIcon /></button>
            <CloseIcon  className="close-button" onClick={noteclose} />

        </div>
        <div className="firstinput-div-container" style={{display: clicktracker ? "none" : ""}}>
            <input  className="firstinputDiv"  placeholder="Take a Note..." readOnly onClick={divclicktracker}></input>
        </div>
        </>
    )
}
export default InputDiv;
