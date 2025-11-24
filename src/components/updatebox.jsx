import React ,{useState,useEffect} from "react";
import "./styles/updatebox.css";

 
function Updatebox({id, title,content,onUpdate}){

    const[newtitle,setNewTitle] = useState(title || "");
    const[newContent , setNewContent] = useState(content || "");

    useEffect(()=>{
        setNewTitle(title || "");
        setNewContent(content|| "");
    },[title,content]);

    function handleSave(){
        onUpdate(newtitle, newContent);
    }

    return(
        <div className="updatebox-container">
            <input 
            className="update-title"
            type="text"
            value={newtitle}
            onChange={(e)=>setNewTitle(e.target.value)}
            placeHolder = "edit title"
            />
             <textarea
             className="update-text-area"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="Edit content"
      />
      <button className="update-button" onClick={handleSave}>submit</button>

        </div>

    )

}
export default Updatebox;