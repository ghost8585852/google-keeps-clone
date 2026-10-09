import { useState ,useEffect } from "react";
import {Navigate} from "react-router";
import axios from "axios";
import { API_URL } from "../fileurl/Url.js";

function ProtectedRoute({children}){
    const [checking , setChecking] = useState(true);
    const [loggedIn , setLoggedIn] = useState(false);

    useEffect(()=>{
         axios.get(`${API_URL}/api/auth/me`,{
            withCredentials:true,
         })
         .then(()=> setLoggedIn(true))
         .catch(()=> setLoggedIn(false))
         .finally(()=> setChecking(false));
    },[]);
if(checking){
    return <p>Checking Login...</p>;
}
if(!loggedIn){
    return <Navigate to ="/login" replace />
}
return children;

}
export default ProtectedRoute;