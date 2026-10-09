import { useState } from "react";
import axios from "axios";
import "./styles/register.css";
import asset2 from "../assets/images/asset-2.webp";

import { API_URL } from "../fileurl/Url.js";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }


  const [color,setcolor] = useState(null);
  async function handleSubmit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try{
      const response = await axios.post(`${API_URL}/api/auth/register`,{
        name:form.name,
        email:form.email,
        password:form.password,
      });
      setcolor("green");
      const responsemessage = response.data;
      setMessage(response.data.message);
      alert("registered sucessfully");
    
      console.log(responsemessage)

    } catch(error){
      setcolor("red")
      const errormessage = 
      error.response?.data?.error || "Could not register . try again";
      setMessage(errormessage);
      console.log("Registration error:,",error);

    }
  }

  return (
    <main className="Register-background">
      <nav >
        <h1>MarkDown</h1>
        <a className="nav-login-link" href="/login">Login</a>
      </nav>
    
      <div className="Register-container">

        <img className="Register-form-image" src={asset2} />

        <form className="Register-form" onSubmit={handleSubmit}>
          <h1>Register</h1>
         <label htmlFor="name">Name</label>
         <input id="name" placeholder="name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" required />

         <label htmlFor="email">Email</label>
         <input id="email" placeholder="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />

         <label htmlFor="password">Password</label>
         <input id="password" placeholder="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" minLength="8" required />

         <label htmlFor="confirmPassword">Confirm password</label>
         <input id="confirmPassword" placeholder="confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" minLength="8" required />

         <button className="Register-button" type="submit">Create account</button>
        {message && <p className="register-message" style={{color:color}}>{message}</p>}
        </form>
        
      </div>
      
      
    </main>
  );
}

export default Register;
