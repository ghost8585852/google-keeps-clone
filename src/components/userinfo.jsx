import { useEffect,useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import "./styles/userpanel.css";
import axios from 'axios';
import { API_URL } from "../fileurl/Url.js";
export function Userpanel(props){


    const [user ,setUser]= useState(null);

    useEffect(()=>{

        async function getUserDetails(){
            try{

                const result = await axios.get(`${API_URL}/api/notes/user-Data`,
                    {withCredentials:true});

                    setUser(result.data.user);
            }catch(error){
                console.error("Could not get user data");
            }
        }

        getUserDetails();
    },[]);
    return(
        <div ref={props.panelRef} className="user-panel-container" style={{display: props.UserpanelState ? "":"none"}}>
            <div className="user-panel-firstsection">
                <p>{user?.name || "Loading..."}</p>
                <p>{user?.email || "Loading..."}</p>
                <button className="Logout-btn" name="logout button" aria-label="logout button"
                 onClick={(e)=>{e.stopPropagation(); props.handleLogout()}}><LogoutIcon/>Sign Out</button>
            </div>
        </div>
    );
}
