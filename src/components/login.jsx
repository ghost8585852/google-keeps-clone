import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import "./styles/login.css";
import loginassetimage from "../assets/images/asset-1.webp";

import { API_URL } from "../fileurl/Url.js";

function Login(){

    const nevigate = useNavigate();

    const [loginval , setloginval] = useState({email:"" , password:""});
    const [loginmessage, setloginmessage] = useState(null);

     function handlechange(event){
        const {name , value} = event.target;
        setloginval((previour)=>({...previour ,[name]:value}));
    }

    const [color,setcolor] = useState(null);
    async function handlesubmit(event){
    event.preventDefault();
    if(!loginval.email || !loginval.password){
        alert("Both email and password are required");
        return;
    }
    try{

    const response = await axios.post(`${API_URL}/api/auth/login`,{
        email:loginval.email,
        password: loginval.password,
    }, {withCredentials:true});
    const responsedetail = response.data;
    console.log(responsedetail);
    setcolor("green")
    setloginmessage(response.data.message);
    alert("Logged in successfully");
    nevigate("/notes");

    } catch(error){
        setcolor("red");
        const errormessage = 
        error.response?.data?.error || "An error occured while login. try again";
        setloginmessage(errormessage);
        console.log("Login error",error);
    }
  }
    return(
        <div className="login-page-background">
            <nav className="login-nav">
                <h1>MarkDown</h1>
            </nav>
            <div className="login-form-container">
                <img className="login-form-image" src={loginassetimage} />
            <form className="login-form" onSubmit={handlesubmit}>
                <h1>Login</h1>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="email" type="email" autoComplete="email" value={loginval.email} onChange={handlechange} required/>
                <label htmlFor="password"></label>Password
                <input id="password" name="password" placeholder="password" type="password" autoComplete="password" value={loginval.password} onChange={handlechange} required/>
                <button className="login-button" type="submit">Login</button> 
                <p>Do not have an account? <a href="/register">Register</a></p>
                {loginmessage && <p className="login-message" style={{color:color}}>{loginmessage}</p>}
            </form>
            
            </div>
        </div>
    );
}

export default Login;