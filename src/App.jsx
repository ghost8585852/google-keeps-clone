import {useState,useEffect,useRef} from "react";
import "./App.css";
import Nav from "./components/Nav.jsx";
import Note from "./components/note.jsx";
import Footer  from "./components/footer.jsx";
import InputDiv from "./components/input.jsx";
import Sidebar from "./components/sidebar.jsx";
import Masonry from "react-masonry-css";
import Updatebox from "./components/updatebox.jsx";
import Backgroundoptions from "./components/backgroundoptionsgrid.jsx";
import { Decision } from "./components/checker.jsx";
import { Userpanel } from "./components/userinfo.jsx";

import axios from "axios";
import { Deleteiptions } from "./components/Deleteoptions.jsx";
import { useNavigate } from "react-router";

import { API_URL } from "./fileurl/Url.js";



 function App(){
  const [items,changeitems] =useState([]);
  const [userId , setuserId] = useState(null);
  const [cacheReady , setCacheReady] = useState(false);
  const navigate = useNavigate();
useEffect(() => {

  async function getcurrentUser(){

    try{
      const response = await axios.get(
      `${API_URL}/api/auth/me`,
      {withCredentials:true}
  );
      setuserId(response.data.userId);
    } catch(error){
      console.log("No active login session");
    }
    
  }
  getcurrentUser();

},[]);

useEffect(()=>{
  if(!userId) return;

  setCacheReady(false);
  const saved = localStorage.getItem(`items_user_${userId}`);

  changeitems(saved ? JSON.parse(saved) : []);
  setCacheReady(true);
},[userId]);


useEffect(()=>{
  if(!userId || !cacheReady) return;


  localStorage.setItem(`items_user_${userId}`, JSON.stringify(items));
},[items , userId , cacheReady]);


  async function getNotes(){
     
    try{
      const response = await axios.get(`${API_URL}/api/notes`,{withCredentials:true});

      const notes = response.data.map((note)=>({
        id:note.id,
        title: note.title,
        content: note.content,
        backgroundColor: note.backgroundcolor,
        ispinned:note.ispinned,
        image: note.image,
        isdeleted:note.isdeleted,
        isachieved:note.isachieved

      })
    );

    changeitems(notes.map(item=>({...item,isselected:false})));

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

   try{

  

    const unsyncednotes = items.filter((item)=>item.synced === false).reverse();
    const idcheck = await axios.get(`${API_URL}/api/notes`,{withCredentials:true});

    for(const note of unsyncednotes){
      try{
        
        const findid = idcheck.data.find((item)=>item.id === note.id);

        let serverId = note.id;


        if(note.terminated === true){
          {
            await axios.delete(`${API_URL}/api/notes`,{
              data:{
                id:note.id
              },
              withCredentials:true,
            });
          }
          
        }
      else if(findid){
          await axios.patch(`${API_URL}/api/notes/${findid.id}`,{
            title:note.title,
            content:note.content,
            backgroundcolor:note.backgroundColor,
            image:note.image,
            ispinned:note.ispinned,
            isdeleted:note.isdeleted,
            isachieved:note.isachieved
            
          },{withCredentials:true});

          serverId = findid.id;
        }
        else{

          const response = await axios.post(`${API_URL}/api/notes`,
          {
            title:note.title,
            content:note.content,
            backgroundcolor:note.backgroundColor,
            image:note.image,
            ispinned:note.ispinned,
            isdeleted:note.isdeleted,
            isachieved:note.isachieved
          },{withCredentials:true});

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
  }finally{
        syncing.current = false;
        console.log("sync completed");
      }

    
  }


  useEffect(()=>{

    if(!userId || !cacheReady) return;

    async function loadData(){
      await syncData();

      await getNotes();
    }

    loadData();
  },[userId,cacheReady]);


 

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
  settoolbar(false);
  // 2. Send the same note to your Express backend
  try {
    const response = await axios.post(`${API_URL}/api/notes`, {
      title:inputhead.title,
      content:inputhead.content,
      backgroundcolor:inputhead.backgroundColor,
      image:inputhead.image,
      isdeleted:inputhead.isdeleted,
      ispinned: inputhead.ispinned,
      isachieved:inputhead.isachieved
    },{withCredentials:true});
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

  changeitems(prev =>
    prev.map(item=>
      item.id == id 
      ? {...item,synced:false,isdeleted:true}
      :item
    )
  );

  try{
    const response = await axios.patch(`${API_URL}/api/notes/${id}`, {
      isdeleted:true,
      image: noteToDelete.image
    },{withCredentials:true});
  
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
  //  console.log(event.target.id);
   const selectediv = Number(event.target.id);
   changepageclickState(selectediv);
   

  }
  function Closepreview(){
    // console.log("clicked");
    changepageclickState(null);
    changeactive(false);
    
    
  }

  const [activenote , changeactive] =useState(false);
  const [palletposition ,changepalletposition]=useState({x:0,y:0});
  const [currentNoteId,changecurrentNoteId]=useState(null);
  
  function palletpositionCheck( id , event){
    // console.log(event.currentTarget.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportPadding = 12;
    const paletteWidth = Math.min(420, window.innerWidth - viewportPadding * 2);
    const paletteHeight = 180;
    const opensBelow = rect.bottom + paletteHeight - 50 + viewportPadding <= window.innerHeight;

    changepalletposition({
      x: opensBelow
        ? rect.bottom + window.scrollY + 8
        : Math.max(viewportPadding, rect.top + window.scrollY - 90 - 1),
      y: Math.max(
        viewportPadding,
        Math.min(rect.left -2, window.innerWidth - paletteWidth - viewportPadding)
      )
    });

    changeactive((previous)=>{
      return ! previous;
    })
    changecurrentNoteId(event.currentTarget.id);
    // console.log(currentNoteId);

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
    await axios.patch(`${API_URL}/api/notes/${newID}`,{
      backgroundcolor: eventValue
    },{withCredentials:true});

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
      await axios.patch(`${API_URL}/api/notes/${noteid}`,{
        image:imagevalue==="null"? null :imagevalue
      },{withCredentials:true});

      changeitems(prev=>
        prev.map(item=>
          item.id === noteid ? {...item,synced:true}: item
        )
      );

      console.log("New background is set successfully for the note");
    }catch(error){
      console.log("Your are offline , Note will be patched later when online");
    }


    // console.log(palletimagevalue);

  };
  // console.log(items);

  const [updateboxstate ,changeUpdateboxstate]=useState(false);
  const [boxid, changeboxid]=useState(null);

  function updatebox(id ){ 
    changeUpdateboxstate((previous)=>{
      return !previous;
    });
    
    changeboxid(id);
  }




  const [DeletedNotes,setDeletedNotes] = useState(false);
  const [ArchivedNotes , setArchivedNotes] = useState(false);

  function Opendeleted(){
    setDeletedNotes(true);
    setArchivedNotes(false);
  }

  function Notes(){
    setDeletedNotes(false);
    setArchivedNotes(false);

    changeitems(prev=>
      prev.map(item=>
        item.isselected === true ? {...item, isselected:false}:item
      )
    );

  }

  function Archivedsection(){
    setArchivedNotes(true);
    setDeletedNotes(false); 
    
    
    changeitems(prev=>
      prev.map(item=>
        item.isselected === true ? {...item, isselected:false}:item
      )
    );


  }


  function Selectbox(event){
    const checked = event.currentTarget.checked;
    const selectboxId = Number(event.currentTarget.id);

    // console.log(selectboxId)
    // console.log(checked);

    changeitems(prev=>
      prev.map(item=>
        item.id ===selectboxId ? {...item,isselected:checked}:item
      )
    );
  }

  async function recycle(){

   

    const selectedNotes = items.filter(item=> item.isselected ===true);

    if(selectedNotes.length === 0){
      return;
    }

    const confirmed = await askForDecision("Sure you wanna recycle ?");

    if(!confirmed){
      return;
    }


    changeitems(prev=>
      prev.map(item=>
        item.isselected === true ? {...item,isselected:false,isdeleted:false,synced:false}:item
      )
    );

    setselectall(false);

    try{
      for(const note of selectedNotes){
        await axios.patch(`${API_URL}/api/notes/${note.id}`,{
          image:note.image,
          isdeleted:false
        },{withCredentials:true});
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

  if(selecteditems.length===0){
    return;
  }



  const confirmed = await askForDecision("Delete notes permanentely ");

  if(!confirmed){
    return;
  }

  setselectall(false);

   changeitems(prev=>
    prev.map(item=>
      item.isselected === true ?
      {...item ,synced:false, terminated:true}:item
    )
  );

  try{
    for(const item of selecteditems){
      await axios.delete(`${API_URL}/api/notes`,{
        data:{
          id:item.id
        },
        withCredentials:true,
      }
      );
      changeitems(prev=>
        prev.filter(item=>
          item.terminated !== true 
        )
      );
    }
    console.log("Note, deleted permanently");
  } catch(error){
    console.log("offline , Note will be deleted on next sync");
  }
 
  }
  
const[selectall ,setselectall] = useState(false);
  function selectAllNotes(event){

    const selectvalue = event.currentTarget.checked;


    setselectall(selectvalue);

    changeitems(prev=>
      prev.map(item=>
        item.isdeleted === true ? {...item , isselected:selectvalue}:item 
      )
    );

  }

  const[toolbar, settoolbar] = useState(false);

  function OpenTools(){
    settoolbar(prev=>!prev);
    changeactive(false);
  }

  async function SyncButton(){
    syncing.current=false;
    await syncData();
  }

  const[sidebar,setsidebar]=useState(false);

  function OpenSidebar(){
    setsidebar(prev=>!prev);
  }

  const visibleNotes = items.filter((item) =>
    DeletedNotes
      ? item.isdeleted === true && item.terminated !== true
      : ArchivedNotes
        ? item.isachieved === true && item.isdeleted !== true && item.terminated !== true
        : item.isdeleted !== true &&
          item.terminated !== true &&
          item.isachieved !== true &&
          item.ispinned !== true
  );

  const pinnedNotes = items.filter((item)=>
    !DeletedNotes &&
    !ArchivedNotes &&
    item.isdeleted !== true &&
    item.terminated !== true &&
    item.isachieved !== true &&
    item.ispinned === true
  );


  async function Applypin(id){
    changeitems(prev=>
      prev.map((item) => item.id === id ?{...item , ispinned: !item.ispinned, synced:false}:item));
  }
  async function archiveset(id){
    
    const noteToArchive = items.find((item) => item.id === id);

    if (!noteToArchive) return;

    

    const confirmed = await askForDecision(noteToArchive.isachieved ? "Remove from archive" : "Send to archive" );

    if(!confirmed){
      return;
    }

    const nextArchiveState = !noteToArchive.isachieved;

    changeitems(prev=>
      prev.map(item =>
        item.id === id
          ? {...item, isachieved: nextArchiveState, synced: false}
          : item
      )
    );

    try {
      await axios.patch(`${API_URL}/api/notes/${id}`, {
        isachieved: nextArchiveState,
        image: noteToArchive.image,
      }, {withCredentials: true});

      changeitems(prev =>
        prev.map(item =>
          item.id === id ? {...item, synced: true} : item
        )
      );
    } catch (error) {
      console.log("Archive change will sync when you are back online");
    }
  }
  
  async function logoutUser(){


    const confirmed = await askForDecision("Sure you want to logout");

    if(!confirmed){
      return;
    }



    try{
      await axios.post(
        `${API_URL}/api/auth/logout`, {},{
          withCredentials:true,
        }
      );
      alert("logged-out successfully");
      navigate("/login");
    }catch(error){
      console.log("Logout failed",error);
    }
  }

  function closeState(){
    settoolbar(false);
  }
  const decisionResolveRef = useRef(null);
  const[checkerText,setcheckerText] = useState("");
  const [checkerOpen, setcheckerOpen]= useState(false);

  function askForDecision(message){
    setcheckerText(message);
    setcheckerOpen(true);

    return new Promise((resolve)=>{
      decisionResolveRef.current = resolve;
    });
  }

  function checkerSet(value){
    setcheckerOpen(false);

    decisionResolveRef.current?.(value);
    decisionResolveRef.current = null;
  }


  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const userPanelRef = useRef(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    if (!isPanelOpen) return;

    function closePanelWhenClickingOutside(event) {
      const clickedPanel = userPanelRef.current?.contains(event.target);
      const clickedUserIcon = userIconRef.current?.contains(event.target);

      if (!clickedPanel && !clickedUserIcon) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", closePanelWhenClickingOutside);

    return () => {
      document.removeEventListener("mousedown", closePanelWhenClickingOutside);
    };
  }, [isPanelOpen]);

function toggleUserPanel() {
  setIsPanelOpen(previous => !previous);
}


  return(
    <>

    


    <Nav 
    RunSync={SyncButton}
    MenuOpen={OpenSidebar} 
    handleLogout={logoutUser}
    OpenPanel={toggleUserPanel}
    userIconRef={userIconRef}
    />

    <Userpanel
    handleLogout={logoutUser} 
    UserpanelState={isPanelOpen}
    panelRef={userPanelRef}
    
    />
   
    <Decision
    checkermessage={checkerText}
    finalcheck={checkerSet}
    checkerState={checkerOpen}
    
    />
   
  


    <div className="center-grid-layout">
      
        <Sidebar 
        ShowDeletednotes={Opendeleted} 
        OpenNotes={Notes}
        OpenArchived={Archivedsection}
        issidebaropen={sidebar}
        divclose={Closepreview}
        />
        <div className="empty-div"></div>
      
      <div className="main-content-side">
      {!DeletedNotes && !ArchivedNotes ? (
        <InputDiv
          onAdd={addItem}
          colorbarOpener={palletpositionCheck}
          id={"input-div"} 
          bcolor={palletvalue} 
          bimage={palletimagevalue} 
          opentoolbar={OpenTools} 
          tool={toolbar}  
          closeTools={closeState}/>
      ) : DeletedNotes ? (
        <Deleteiptions
       recycleNotes = {recycle}
       delNotes={permanentDelete}
       selectAll={selectAllNotes}
       selectreset={selectall}
        />
      ) : null}

       <div
       className="Notes-section"
       style={{display: pinnedNotes.length === 0 || DeletedNotes || ArchivedNotes ? "none": ""}}
       >
        <h4 className="section-heading">Pins</h4>
        <hr/>
       <Masonry
       breakpointCols={{ default: 5,1490:4, 1130: 3, 890: 2, 673: 1 }}
       className="main-container"
       columnClassName="my-masonry-grid_column"
       >
        
        {
          pinnedNotes.map((x)=>{
            return <Note
                    key={x.id} 
                      id={x.id} 
                      title={x.title}
                      message={x.content}
                      onDelete={DeleteItem} 
                      divstyle={pagestyleapplyer} 
                      oncheckid={pageclickstate}
                      divclose={Closepreview} 
                      pin={Applypin}
                      archive={archiveset}
                      colorbarCheck={palletpositionCheck} 
                      notebackcolor={x.backgroundColor}
                      selectedimage={x.image}
                      ispinned={x.ispinned}
                      archived={x.isachieved}
                      updatebutton={updatebox}
                      del={x.isdeleted}
                      selectNote={Selectbox}
                      show={DeletedNotes}
                      selectState={x.isselected}
                      open={pageclickstate}
                      activeNote={pageclickstate}
                      DeletedState={DeletedNotes}
            
                    
                    />
          })
        }
       </Masonry>
       </div>



      <div
      className="Notes-section"
      >
        <h4
        className="section-heading"
        >
          {DeletedNotes ? "Bin" : ArchivedNotes ? "Archive" : "Notes"}
        </h4>
        <hr/>
      <Masonry
      breakpointCols={{ default: 5,1490:4, 1130: 3, 890: 2, 673: 1 }}
      className="main-container"
      
      columnClassName="my-masonry-grid_column">
        
        {visibleNotes.length === 0 && pinnedNotes.length === 0 ? (
          <p className="no-notes">Empty</p>
        ) : (
          visibleNotes.map((x)=>{
            return <Note key={x.id} 
                      id={x.id} 
                      title={x.title}
                      message={x.content}
                      onDelete={DeleteItem} 
                      divstyle={pagestyleapplyer} 
                      oncheckid={pageclickstate}
                      divclose={Closepreview} 
                      pin={Applypin}
                      archive={archiveset}
                      colorbarCheck={palletpositionCheck} 
                      notebackcolor={x.backgroundColor}
                      selectedimage={x.image}
                      ispinned={x.ispinned}
                      archived={x.isachieved}
                      updatebutton={updatebox}
                      del={x.isdeleted}
                      selectNote={Selectbox}
                      show={DeletedNotes}
                      selectState={x.isselected}
                      open={pageclickstate}
                      activeNote={pageclickstate}
                      DeletedState={DeletedNotes}
                    />
          })
        )}
                        
      </Masonry>
      </div>
      {activenote !== false && (
        <div className="pallet-frame"
         style={{
          top:palletposition.x,
          left:palletposition.y,
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
            await axios.patch(`${API_URL}/api/notes/${boxid}`,{
              title :updatedtitle,
              content:updatedcontent
            },{withCredentials:true});

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
