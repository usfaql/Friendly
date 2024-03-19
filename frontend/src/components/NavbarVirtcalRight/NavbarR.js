import React, { useEffect, useState, useContext } from 'react'
import "./style.css"
import axios, { all } from 'axios';
import { userContext } from "../../App"
import { useNavigate } from 'react-router-dom';
function NavbarV() {
    const navigate = useNavigate();
    const { token, userId, checkValue} = useContext(userContext);
    const infoMe = JSON.parse(localStorage.getItem("InfoMe"));
    const [allUser, setAllUser] = useState(null);
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    useEffect(()=>{
        axios.get(`https://friendly-29oc.onrender.com/users/`, config).then((result) => {
            setAllUser(result.data.Users);
        }).catch((err) => {
            
        });
    },[])
  return (
    <div className='contenter-nav'>

        <div className={!checkValue? 'nav-bar': 'nav-bar-night'}>
            <div style={{fontWeight:"bold", textAlign:"left", marginLeft:"10px", marginBottom:"10px", paddingTop:"10px"}}>Suggested For you</div>
            <div className={!checkValue? 'line': 'line-night'} ></div>
            <div>
            {allUser && allUser?.map((e,i)=>{
                 
                 if(userId && e._id === userId){

                }else  if(infoMe && infoMe.following.includes(e._id)){
                }else{
                
                return(
                    <div onClick={()=>{
                        localStorage.setItem("userIdG", e._id);
                        navigate("/profile");
                    }}>
                <div style={{display: "flex", flexDirection: "row",justifyContent:"space-between", marginTop:"5px",marginLeft:"5px" ,padding: "5px", textAlign:"center", placeItems: "center" ,gap:"10px"}}>
                <div style={{display:"flex", textAlign:"center", placeItems: "center" , gap:"5px"}}>
                <img src={`${e.image}`} style={{width:"48px", borderRadius:"24px"}}/>
                <div style={{fontWeight:"bold"}}>{e.firstName}</div>
                </div>
                <button className='btn-follow'>Follow</button>
            </div>
            <div className={!checkValue? 'line': 'line-night'}></div>
            </div>
                )
            }
            })}
            </div>
            </div>

    </div>

    
    
  )
}

export default NavbarV