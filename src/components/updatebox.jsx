import {useState,useEffect} from "react";
import "./styles/updatebox.css";
import {useEditor,EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { Toolbar } from "./toolbar";

 
function Updatebox({id, title,content,onUpdate}){

    const[newtitle,setNewTitle] = useState(title || "");
    const[newContent , setNewContent] = useState(content || "");


     const updateboxeditor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    content: content || "",
    contentType: "markdown",
    onUpdate: ({ editor }) => {
      setNewContent(editor.getMarkdown());
    },
  });  



  useEffect(() => {
    setNewTitle(title || "");
    setNewContent(content || "");

    if (updateboxeditor) {
        updateboxeditor.commands.setContent(content || "",
             {
            contentType: "markdown",
        });
    }
}, [title, content, updateboxeditor]);

    async function handleSave(){
      onUpdate(newtitle, newContent);
    }

 

    return(
        <div className="updatebox-container">
            <input 
            className="update-title"
            type="text"
            value={newtitle}
            onChange={(e)=>setNewTitle(e.target.value)}
            placeholder = "edit title"
            />
             {/* <textarea
             className="update-text-area"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="Edit content"
      /> */}

      <Toolbar 
      editor={updateboxeditor}
      className="updatebox-editor"
      
      />

      <EditorContent  className="update-text-area" editor={updateboxeditor}/>
      <button className="update-button" onClick={handleSave}>Save</button>

        </div>

    )

}
export default Updatebox;