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
        <div style={{display:"flex" , width:"90vw", height:"100vh",margin:"0",padding:"0" , justifyContent:"center", alignItems:"center"}}>
            <div style={{width:"50%", height:"70%" ,alignItems:"center", display:"flex", flexDirection:"column", justifyContent:"center"}}>
                <div>
                <img style={{width:"35%"}} src={require("../Image/logo.png")}/>
                </div>
                <p style={{fontSize:"20px"}}>Create an account in an easy and inexpensive way</p>
            </div>

            <div style={{width:"50%", display:"flex", alignItems:"center", justifyContent:"center" ,height:"70%"}}>
                
                <div style={{width:"60%", backgroundColor:"white", height:"100%", justifyContent:"center", display:"flex",borderRadius:"8px", flexDirection:"column"}}>
                    <div style={{height:"25%", display:"flex", justifyContent:"center", alignItems:"center", color:"#018b92", fontWeight:"bold", fontSize:"23px"}}>Login</div>
                    <div style={{width:"100%", backgroundColor:"white", height:"fit-content", justifyContent:"center", display:"flex", flexDirection:"column"}}>
                        <div className={anError? "errorhint" : "errorhintdis"}>{contentError}</div>
                        <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
                            <div style={{width:"90%",display:"flex", justifyContent:"center"}}>
                                <input style={{width:"100%"}} placeholder="Email" onChange={(e)=>{
                                    setEmail(e.target.value);
                                }}/>
                            </div>

                        </div>

                        <div style={{display:"flex", width:"100%" ,justifyContent:"center"}}>
                            <div style={{display:"flex", width:"90%" ,justifyContent:"center"}}>
                                <input style={{width:"100%"}} type="password" placeholder="Password" onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}/>
                            </div>
                        </div>
                        <div style={{width:"100%"}}>
                            <button className="btn-login"
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
                                    console.log(err.response.data.message);
                                    setAnError(true);
                                    setContentError(err.response.data.message);
                                })
                            }}>Login</button>
                        </div>
                    </div>
                    <div style={{height:"25%",display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"5px"}}> <label>Don't have an account? </label> <Link to={"/register"}> Register</Link></div>
                </div>
                
            </div>
        </div>
    )
}

export default Login