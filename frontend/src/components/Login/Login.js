import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"
import { userContext } from "../../App";

const Login = ()=>{
    const{setUserId, setToken, setIsLoggedIn}=useContext(userContext)
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [anError, setAnError] = useState(false);
    const [contentError, setContentError] = useState("");
    return(
        <div style={{display:"flex" , width:"100vw", height:"100vh",margin:"0",padding:"0" , justifyContent:"center", alignItems:"center"}}>
            
            <div className="container-login">
                
                <div className="container-login-2">
                    <div>
                        <img style={{width:"15%", borderRadius:"100%"}} src={require("../Image/logo.png")}/>
                    </div>
                        
                    <div style={{height:"15%", display:"flex", justifyContent:"center", alignItems:"center", color:"#2a86ff", fontWeight:"bold", fontSize:"23px"}}>Login</div>
                    <div style={{width:"100%", height:"fit-content", justifyContent:"center", display:"flex", flexDirection:"column"}}>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <div className={anError? "errorhint" : "errorhintdis"}>{contentError}</div>
                        </div>
                        
                        <div style={{width:"100%",display:"flex",marginBottom:"20px", justifyContent:"center"}}>
                            <div style={{width:"90%",display:"flex", justifyContent:"center"}}>
                                <input className="input" style={{width:"100%"}} placeholder="Email" onChange={(e)=>{
                                    setEmail(e.target.value);
                                }}/>
                            </div>

                        </div>

                        <div style={{display:"flex", width:"100%" ,marginBottom:"20px",justifyContent:"center"}}>
                            <div style={{display:"flex", width:"90%" ,justifyContent:"center"}}>
                                <input className="input" style={{width:"100%"}} type="password" placeholder="Password" onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}/>
                            </div>
                        </div>
                        <div style={{width:"100%" ,marginBottom:"20px"}}>
                            <button className="btn-login" style={{padding:"10px"}}
                            onClick={()=>{
                                axios.post("https://friendly-29oc.onrender.com/users/login", {email, password}).then((result)=>{
                                    setIsLoggedIn(true);
                                    setUserId(result.data.userId);
                                    setToken(result.data.token);
                                    localStorage.setItem("token", result.data.token);
                                    localStorage.setItem("userId", result.data.userId);
                                    navigate("/");
                                    setAnError(false);
                                }).catch((err)=>{
                                    setAnError(true);
                                    setContentError(err.response.data.message);
                                })
                            }}>Login</button>

                            <button className="btn-login-demo" style={{padding:"10px"}}
                            onClick={()=>{
                                axios.post("https://friendly-29oc.onrender.com/users/login", {email :"usfaql@gmail.com", password :"1234@"}).then((result)=>{
                                    setIsLoggedIn(true);
                                    setUserId(result.data.userId);
                                    setToken(result.data.token);
                                    localStorage.setItem("token", result.data.token);
                                    localStorage.setItem("userId", result.data.userId);
                                    axios.put(`https://friendly-29oc.onrender.com/users/${result.data.userId}/status`,{isOnline : true}, {
                                        headers: { Authorization: `Bearer ${result.data.token}` }
                                      }).then((result) => {
                                      navigate("/");
                                      setAnError(false);
                                      }).catch((err) => {
                                        console.error(err);
                                      });
                                }).catch((err)=>{
                                    setAnError(true);
                                    setContentError(err.response.data.message);
                                })
                            }}>Demo</button>
                        </div>
                    </div>
                    <div style={{height:"5%",display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"5px"}}> <label style={{color:"white"}}>Don't have an account? </label> <Link to={"/register"}> Register</Link></div>
                </div>
                
            </div>
        </div>
    )
}

export default Login