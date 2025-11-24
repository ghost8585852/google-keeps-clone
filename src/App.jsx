import React,{useState,useEffect} from "react";
import "./App.css";
import Nav from "./components/Nav.jsx";
import Note from "./components/note.jsx";
import Footer  from "./components/footer.jsx";
import InputDiv from "./components/input.jsx";
import Sidebar from "./components/sidebar.jsx";
import Masonry from "react-masonry-css";
import Updatebox from "./components/updatebox.jsx";
import Backgroundoptions from "./components/backgroundoptionsgrid.jsx";


function App(){
  const [items,changeitems] =useState(()=>{
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  }); // using this to create array of objects.
  

useEffect(() => {
  localStorage.setItem("items", JSON.stringify(items));
}, [items]);


  const [deletedItems, setDeletedItems] = useState(() => {
  const savedDeleted = localStorage.getItem("deletedItems");
  return savedDeleted ? JSON.parse(savedDeleted) : [];
});



useEffect(() => {
  localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
}, [deletedItems]);




 

  function addItem(inputhead){ // function to add new object in the array.
    changeitems((previous)=>{
      return inputhead.title !=="" || inputhead.content !=="" ? [...previous,inputhead]:[...previous];
    })

  }

function DeleteItem(id) {
  const noteToDelete = items[id];   // get deleted note

  if (noteToDelete) {
    setDeletedItems(prev => [...prev, noteToDelete]); // run ONCE
  }

  changeitems(prev => prev.filter((item, index) => index !== id));
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
    previous.map((item,index)=>
    index===eventIndex ? {...item,backgroundColor:eventValue}:item)
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
      previous.map((item,index)=>
      index ===noteindex ? {...item, image:imagevalue==="null"? null :imagevalue} :item)
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
            return <Note key={index} 
                      id={index} 
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

      {updateboxstate !==false && (
        <Updatebox 
        id={boxid}
        title={items[boxid]?.title}
        content={items[boxid]?.content} 
        onUpdate={(updatedtitle,updatedcontent)=>{
          changeitems(prev =>
            prev.map((item,index)=>
              index ===boxid ? {...item, title:updatedtitle,content:updatedcontent}:item
            )
          );
          changeUpdateboxstate(false);
        }}
        />  
      )}
      

      </div>
      
    </div>

    < Footer />
    </>
  )
}
export default App;
