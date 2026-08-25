import "./styles/deleteoption.css";

export function Deleteiptions(props){
    return(
        <div className="deleteoptions-container">
            <div className="buttons-container">
                <button className="delbutton-style" onClick={(e)=>{e.stopPropagation() , props.delNotes()}} >Delete</button>
                <button className="delbutton-style" onClick={(e)=>{e.stopPropagation() , props.recycleNotes()}} >Recycle</button>
            </div>
            <div className="checkbutton-container">
                <p>Select All</p>
                <input className="checkboxx" onClick={(e)=>{e.stopPropagation()} }  onChange={props.selectAll} checked={props.selectreset} type="checkbox"/>
            </div>


           
            
        </div>
        )
}