import React from "react";
import "./styles/Background.css";
import InvertColorsOffOutlinedIcon from '@mui/icons-material/InvertColorsOffOutlined';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import bimage1 from "../assets/images/bimage-1.png";
import bimage2 from "../assets/images/bimage-2.png";
import bimage3 from "../assets/images/bimage-3.png";
import bimage4 from "../assets/images/bimage-4.png";
import bimage5 from "../assets/images/bimage-5.png";
import bimage6 from "../assets/images/bimage-6.png";
import bimage7 from "../assets/images/bimage-7.png";
import bimage8 from "../assets/images/bimage-8.png";
import bimage9 from "../assets/images/bimage-9.png";
 
function Backgroundoptions( props){
    return(
        <div className="pallet-container" id={props.id} onClick={(e)=>{e.stopPropagation()}} >
            <div className="color-container" id={props.id}>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} value=" "><InvertColorsOffOutlinedIcon /></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#FAAFA8"}} value="#FAAFA8"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#E2F6D3"}} value="#E2F6D3"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#F59272"}} value="#F59272"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#FFF8B8"}} value="#FFF8B8"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#B4DDD3"}} value="#B4DDD3"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#D4E4ED"}} value="#D4E4ED"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#AECCDC"}} value="#AECCDC"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#D3BFDB"}} value="#D3BFDB"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#F6E2DD"}} value="#F6E2DD"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#E9E3D4"}} value="#E9E3D4"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#EFEFF1"}} value="#EFEFF1"></button>
                <button className="color-buttons"  id={props.id} onClick={props.palletvalueCatcher} style={{backgroundColor:"#DDEAED"}} value="#DDEAED"></button>

            </div>
            <hr />
            <div className="background-image-container" id={props.id}>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id} value="null" ><HideImageOutlinedIcon /></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-1"> <img  src={bimage1}   className="image"  /></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-2"> <img  src={bimage2}   className="image" /></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-3"> <img  src={bimage3}   className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-4"> <img  src={bimage4}  className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-5"> <img  src={bimage5}   className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-6"> <img  src={bimage6}   className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-7"> <img  src={bimage7}   className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-8"> <img  src={bimage8}   className="image"/></button>
                <button className="background-image-buttons" onClick={props.imagevaluecatcher} id={props.id}  value="bimage-9"> <img  src={bimage9}   className="image"/></button>

            </div>


        </div>

    )
}
export default Backgroundoptions;