import React, { useEffect, useState, useContext } from 'react'
import "./style.css"
import axios from 'axios';
import { userContext } from "../../App"
import { useNavigate } from 'react-router-dom';
import { dataContext } from '../Main/Main';

function NavbarV() {
    const navigate = useNavigate();
    const { token, userId ,checkValue} = useContext(userContext);
    const { data, setData, dataFollowing , setSelected, selected} = useContext(dataContext);
    const [nameUser, setNameUser] = useState(null);
    const [imageUser, setImageUser] = useState(null);
    const [lengthFollower, setLengthFollower] = useState(null);
    const [lengthFollowing, setLengthFollowing] = useState(null);
    const [lengthPosts, setLengthPosts] = useState(null);
    const [bio , setBio] = useState(null);
    
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    useEffect(()=>{
        axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
            setNameUser(result.data.user.firstName + " "+ result.data.user.lastName);
            setImageUser(result.data.user.image);
            setLengthFollower(result.data.user.follower.length);
            setLengthFollowing(result.data.user.following.length);
            setBio(result.data.user.bio);
        }).catch((err) => {
            
        });

        axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${userId}`,config).then((result) => {
          setLengthPosts(result.data.posts.length);
        }).catch((err) => {
          
        });
    },[]);


    
  return (
    <div className='contenter-nav'>
        <div className={!checkValue? 'nav-bar': 'nav-bar-night'}>
            <div className="containers" >
                <img src={`${imageUser}`} className='user-image-profile'/>
            </div>
            <div className="container-user-info">
            <div className='nameUser'>{nameUser}</div>
            
            </div>
            <div style={{marginTop:"5px", color:"#2a86ff", whiteSpace:"pre-line"}}>{bio}</div>

            <div className='container-info-profile' style={{display:"flex", flexDirection:"row", margin:"20px", justifyContent:"center", textAlign:"center", gap:"15px"}}>
                <div>
                <div>{lengthPosts}</div>
                <div>Post</div>
                </div>

                <div>
                <div>{lengthFollower}</div>
                <div>Followers</div>
                </div>

                <div>
                <div>{lengthFollowing}</div>
                <div>Following</div>
                </div>
            </div>

            <div className={checkValue ? "btn-open-profile-night" : "btn-open-profile"} onClick={()=>{
                localStorage.setItem("userIdG", userId);
                navigate("/profile");
            }}>Profile</div>
        </div>
       

        <div className={!checkValue? 'nav-bar': 'nav-bar-night'} style={{marginBottom:"0", paddingBottom:"0"}}>
            <div className={selected === "home" ? 'home-selected': 'home' } onClick={()=>{
                setSelected("home");
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M10 12h4v4h-4z" /></svg>
            Home
            </div>
            <div className={selected === "explore" ? 'explore-selected': 'explore' } onClick={()=>{
                setSelected("explore");
                
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-edge" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.978 11.372a9 9 0 1 0 -1.593 5.773" /><path d="M20.978 11.372c.21 2.993 -5.034 2.413 -6.913 1.486c1.392 -1.6 .402 -4.038 -2.274 -3.851c-1.745 .122 -2.927 1.157 -2.784 3.202c.28 3.99 4.444 6.205 10.36 4.79" /><path d="M3.022 12.628c-.283 -4.043 8.717 -7.228 11.248 -2.688" /><path d="M12.628 20.978c-2.993 .21 -5.162 -4.725 -3.567 -9.748" /></svg>
                Explore
            </div>
        </div>
       


    </div>

    
    
  )
}

export default NavbarV