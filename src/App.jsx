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

    changeitems(notes);
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
        await axios.post("http://localhost:3000/api/notes",
          {
            title:note.title,
            content:note.content,
            backgroundcolor:note.backgroundColor,
            image:note.image
          });
          console.log("started");
          changeitems((previous)=>
          previous.map((item)=>
          item.id === note.id
            ? {...item , synced:true}
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


  const [deletedItems, setDeletedItems] = useState(() => {
  const savedDeleted = localStorage.getItem("deletedItems");
  return savedDeleted ? JSON.parse(savedDeleted) : [];
});



useEffect(() => {
  localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
}, [deletedItems]);




 

async function addItem(inputhead) {
  if (inputhead.title === "" && inputhead.content === "") {
    return;
  }
 // 1. Update React state

 const savedstate = {
  ...inputhead,
  synced:false,
  id: crypto.randomUUID(),

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

function DeleteItem(id) {
  const noteToDelete = items.find((item)=>item.id === id);   // get deleted note

  if (noteToDelete) {
    setDeletedItems(prev => [...prev, noteToDelete]); // run ONCE
  }


  changeitems(prev => prev.filter((item) => item.id !== id));
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

  function newValue(event){ 
    
    const eventId = event.currentTarget.id;
    const eventValue= event.currentTarget.value;
    if(eventId ==="input-div"){
    changepalletvalue(eventValue);
    }

    const eventIndex = Number(eventId);

    if(isNaN(eventIndex)) return;

    changeitems((previous)=>
    previous.map((item)=>
    item.id===eventIndex ? {...item,backgroundColor:eventValue}:item)
  )


    // console.log(palletvalue);
  };

  function imagecatcher(event){

    const eventId = event.currentTarget.id;
    const imagevalue = event.currentTarget.value;

    if(eventId==="input-div"){
      changepalletimagevalue(imagevalue);
      
    }


    const noteindex = Number(eventId);
    if(isNaN(noteindex)) return;


    changeitems(previous =>
      previous.map((item)=>
      item.id === noteindex ? {...item, image:imagevalue==="null"? null :imagevalue} :item)
    )


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



  


  return(
    <>
    <Nav />
    <div className="center-grid-layout">
      
        <Sidebar />
        <div ></div>
      
      <div className="main-content-side">
        <InputDiv onAdd={addItem}  colorbarOpener={palletpositionCheck} id={"input-div"} bcolor={palletvalue} bimage={palletimagevalue} /> 
  
      <Masonry
      breakpointCols={{ default: 5, 1100: 3, 700: 2, 500: 1 }}
      className="main-container">
        {
          items.map((x,index)=>{
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
        onUpdate={(updatedtitle,updatedcontent)=>{
          changeitems(prev =>
            prev.map((item)=>
              item.id ===boxid ? {...item, title:updatedtitle,content:updatedcontent}:item
            )
          );
          changeUpdateboxstate(false);
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
