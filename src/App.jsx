import React,{useState,useEffect,useRef} from "react";
import "./App.css";
import Nav from "./components/Nav.jsx";
import Note from "./components/note.jsx";
import Footer  from "./components/footer.jsx";
import InputDiv from "./components/input.jsx";
import Sidebar from "./components/sidebar.jsx";
import Masonry from "react-masonry-css";
import Updatebox from "./components/updatebox.jsx";
import Backgroundoptions from "./components/backgroundoptionsgrid.jsx";
import axios from "axios";
import { Deleteiptions } from "./components/Deleteoptions.jsx";


function App(){
  const [items,changeitems] =useState(()=>{
   const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  }); // using this to create array of objects.
  


useEffect(() => {
  localStorage.setItem("items", JSON.stringify(items));
}, [items]);



  async function getNotes(){
     
    try{
      const response = await axios.get("http://localhost:3000/api/notes");

      const notes = response.data.map((note)=>({
        id:note.id,
        title: note.title,
        content: note.content,
        backgroundColor: note.backgroundcolor,
        image: note.image,
        isdeleted:note.isdeleted

      })
    );

    changeitems(notes.map(item=>({...item,isselected:false})));
    // setDeletedItems(notes.filter((item)=>item.isdeleted === true));
    console.log(items);
    }catch(error){
      console.error("could not get notes:",error);
    }
  } 



  const syncing = useRef(false);

 async function syncData(){

  if(syncing.current){
    console.log("sync is already running");
    return;
  }

  syncing.current= true;
   console.log("sync started");

    const unsyncednotes = items.filter((item)=>item.synced === false).reverse();
   

    for(const note of unsyncednotes){
      try{
        const idcheck = await axios.get("http://localhost:3000/api/notes");
        
        const findid = idcheck.data.find((item)=>item.id === note.id);

        let serverId = note.id;


        if(note.terminated === true){
          {
            await axios.delete(`http://localhost:3000/api/notes`,{
              data:{
                id:note.id
              }
            });
          }
          
        }
      else if(findid){
          await axios.patch(`http://localhost:3000/api/notes/${findid.id}`,{
            title:note.title,
            content:note.content,
            backgroundcolor:note.backgroundColor,
            image:note.image,
            isdeleted:note.isdeleted
            
          });

          serverId = findid.id;
        }
        else{

          const response = await axios.post("http://localhost:3000/api/notes",
          {
            title:note.title,
            content:note.content,
            backgroundcolor:note.backgroundColor,
            image:note.image,
            isdeleted:note.isdeleted
          });

          serverId = response.data.id;
        }
        
        
          console.log("started");
          changeitems((previous)=>
          previous.map((item)=>
          item.id === note.id
            ? {...item ,id: serverId, synced:true}
          :item));
          console.log("all the unsaved notes are synced successfully");

      }catch(error){
        console.log("still offline, could not sync:" ,note.title);

      }
    }

    syncing.current = false;
  }


  useEffect(()=>{
    async function loadData(){
      await syncData();

      await getNotes();
    }

    loadData();
  },[]);


//   const [deletedItems, setDeletedItems] = useState(() => {
//   const savedDeleted = localStorage.getItem("deletedItems");
//   return savedDeleted ? JSON.parse(savedDeleted) : [];
// });



// useEffect(() => {
//   localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
// }, [deletedItems]);




 

async function addItem(inputhead) {
  if (inputhead.title === "" && inputhead.content === "") {
    return;
  }
 // 1. Update React state

 const savedstate = {
  ...inputhead,
  synced:false,
  id: -Date.now(),

 };

 changeitems((previous) => [savedstate,...previous]);
  // 2. Send the same note to your Express backend
  try {
    const response = await axios.post("http://localhost:3000/api/notes", {
      title:inputhead.title,
      content:inputhead.content,
      backgroundcolor:inputhead.backgroundColor,
      image:inputhead.image,
      isdeleted:inputhead.isdeleted
    });
    console.log("Note saved to database");

    const NewNote = response.data
    changeitems((previous)=>
      previous.map((item)=>
        item.id === savedstate.id 
          ? {...item,synced:true,id:NewNote.id}: item
      )
    );
  } catch (error) {

    console.error("Could not save note to database:", error);
  }

  
 
}

async function DeleteItem(id) {
  const noteToDelete = items.find((item)=>item.id === id);   // get deleted note

  // if (noteToDelete) {
  //   setDeletedItems(prev => [...prev, {...noteToDelete,isdeleted:true}]); // run ONCE
  // }
  

  changeitems(prev =>
    prev.map(item=>
      item.id == id 
      ? {...item,synced:false,isdeleted:true}
      :item
    )
  );

  try{
    const response = await axios.patch(`http://localhost:3000/api/notes/${id}`, {
      isdeleted:true,
      image: noteToDelete.image
    });
  
   changeitems(prev =>
      prev.map(item =>
        item.id == id
          ? {...item, synced:true}
          : item
      )
    );
  }catch(error){
    console.error("Note will sync on reload ");
  }

  

}



  const [pageclickstate,changepageclickState]=useState(null);

  function pagestyleapplyer(event){
   console.log(event.target.id);
   const selectediv = Number(event.target.id);
   changepageclickState(selectediv);
   

  }
  function Closepreview(){
    console.log("clicked");
    changepageclickState(null);
  }

  const [activenote , changeactive] =useState(false);
  const [palletposition ,changepalletposition]=useState({x:0,y:0});
  const [currentNoteId,changecurrentNoteId]=useState(null);
  
  function palletpositionCheck( id , event){
    // console.log(event.currentTarget.id);
    const react = event.currentTarget.getBoundingClientRect();

    changepalletposition({ x :react.top + window.scrollY , y :react.left});

    changeactive((previous)=>{
      return ! previous;
    })
    changecurrentNoteId(event.currentTarget.id);
    console.log(currentNoteId);

  //  console.log(palletposition);

  }

  useEffect(()=>{
    function handleClickOutside(){
      changeactive(false);
    }
    window.addEventListener("click",handleClickOutside);


    return()=>{
      window.removeEventListener("click",handleClickOutside);
    };
  },[]);

  const[palletvalue,changepalletvalue]=useState(null);
  const[palletimagevalue,changepalletimagevalue]= useState(null);

async function newValue(event){ 
    
    const eventId = event.currentTarget.id;
    const eventValue= event.currentTarget.value;
    if(eventId ==="input-div"){
    changepalletvalue(eventValue);
    }

    const newID = Number(eventId);

    if(isNaN(newID)) return;

    changeitems((previous)=>
    previous.map((item)=>
    item.id === newID ? {...item,synced:false, backgroundColor:eventValue}:item)
  )

  try{
    await axios.patch(`http://localhost:3000/api/notes/${newID}`,{
      backgroundcolor: eventValue
    });

    changeitems(prev=>
      prev.map(item=>
        item.id === newID ? {...item,synced:true}:item
      )
    );

    console.log("Note,successfully updated");
  }catch(error){
    console.log("offline , Note will be updated later when online ");
  }


    // console.log(palletvalue);
  };

  async function imagecatcher(event){

    const eventId = event.currentTarget.id;
    const imagevalue = event.currentTarget.value;

    if(eventId==="input-div"){
      changepalletimagevalue(imagevalue);
      
    }


    const noteid = Number(eventId);
    if(isNaN(noteid)) return;


    changeitems(previous =>
      previous.map((item)=>
      item.id === noteid ? {...item,synced:false, image:imagevalue==="null"? null :imagevalue} :item)
    )

    try{
      await axios.patch(`http://localhost:3000/api/notes/${noteid}`,{
        image:imagevalue==="null"? null :imagevalue
      });

      changeitems(prev=>
        prev.map(item=>
          item.id === noteid ? {...item,synced:true}: item
        )
      );

      console.log("New background is set successfully for the note");
    }catch(error){
      console.log("Your are offline , Note will be patched later when online");
    }


    console.log(palletimagevalue);

  };
  console.log(items);

  const [updateboxstate ,changeUpdateboxstate]=useState(false);
  const [boxid, changeboxid]=useState(null);

  function updatebox(id ){ 
    changeUpdateboxstate((previous)=>{
      return !previous;
    });
    
    changeboxid(id);
  }




  const [DeletedNotes,setDeletedNotes] = useState(false);

  function Opendeleted(){
    setDeletedNotes(true);
  }

  function Notes(){
    setDeletedNotes(false);
  }


  function Selectbox(event){
    const checked = event.currentTarget.checked;
    const selectboxId = Number(event.currentTarget.id);

    console.log(selectboxId)
    console.log(checked);

    changeitems(prev=>
      prev.map(item=>
        item.id ===selectboxId ? {...item,isselected:checked}:item
      )
    );
  }

  async function recycle(){

    const selectedNotes = items.filter(item=> item.isselected ===true);

    changeitems(prev=>
      prev.map(item=>
        item.isselected === true ? {...item,isselected:false,isdeleted:false,synced:false}:item
      )
    );

    try{
      for(const note of selectedNotes){
        await axios.patch(`http://localhost:3000/api/notes/${note.id}`,{
          image:note.image,
          isdeleted:false
        });
      }
      console.log("Note is successfully recycled");
    }catch(error){
      console.log("offline , Note will be patched later");
    }
  }

 async function permanentDelete(){

  const selecteditems = items.filter(
    item => item.isselected === true
  );

   changeitems(prev=>
    prev.map(item=>
      item.isselected === true ?
      {...item ,synced:false, terminated:true}:item
    )
  );

  try{
    for(const item of selecteditems){
      await axios.delete(`http://localhost:3000/api/notes`,{
        data:{
          id:item.id
        }
      }
      );
    }
    console.log("Note, deleted permanently");
  } catch(error){
    console.log("offline , Note will be deleted on next sync");
  }
 
  }



  


  return(
    <>
    <Nav />
    <div className="center-grid-layout">
      
        <Sidebar 
        ShowDeletednotes={Opendeleted} 
        OpenNotes={Notes}
        />
        <div ></div>
      
      <div className="main-content-side">
      {DeletedNotes === false ?  <InputDiv onAdd={addItem}  colorbarOpener={palletpositionCheck} id={"input-div"} bcolor={palletvalue} bimage={palletimagevalue} /> :
       <Deleteiptions
       recycleNotes = {recycle}
       delNotes={permanentDelete}
       /> }
  
      <Masonry
      breakpointCols={{ default: 5, 1100: 3, 700: 2, 500: 1 }}
      className="main-container">
        {
          items.filter((item)=> DeletedNotes ? item.isdeleted == true && item.terminated !== true  : item.isdeleted !==true).map((x,index)=>{
            return <Note key={x.id} 
                      id={x.id} 
                      title={x.title}
                      message={x.content}
                      onDelete={DeleteItem} 
                      divstyle={pagestyleapplyer} 
                      oncheckid={pageclickstate}
                      divclose={Closepreview} 
                      colorbarCheck={palletpositionCheck} 
                      notebackcolor={x.backgroundColor}
                      selectedimage={x.image}
                      updatebutton={updatebox}
                      del={x.isdeleted}
                      selectNote={Selectbox}
                      show={DeletedNotes}
                      selectState={x.isselected}
                    />
          })
        }
                        
      </Masonry>
      {activenote!==false && (
        <div className="pallet-frame"
         style={{
          top:palletposition.x +30,
          left:palletposition.y -1,
          zIndex:999,
         }}>
          <Backgroundoptions id={currentNoteId}  palletvalueCatcher={newValue}  imagevaluecatcher={imagecatcher}/>
        </div>
      )}

      {updateboxstate !==false && (()=>{

        const selectNote = items.find((item)=> item.id === boxid);

        return(
        <Updatebox 
        id={boxid}
        title={selectNote ?.title}
        content={selectNote ?.content} 
        onUpdate={async(updatedtitle,updatedcontent)=>{


          changeitems(prev =>
            prev.map((item)=>
              item.id ===boxid ? {...item, title:updatedtitle,content:updatedcontent, synced:false,}:item
            )
          );
          changeUpdateboxstate(false);

          try{
            await axios.patch(`http://localhost:3000/api/notes/${boxid}`,{
              title :updatedtitle,
              content:updatedcontent
            });

            changeitems(prev =>
              prev.map(item=>
                item.id === boxid
                ? {
                  ...item, syncData:true
                }:item
              )
            );
            console.log("Note updated succesfully");
          }catch(error) {
            console.log("You are offline - Note will be patched later");
          }
          
        }}
        />  );
      }
      )()}
      

      </div>
      
    </div>

    < Footer />
    </>
  )
}
export default App;
