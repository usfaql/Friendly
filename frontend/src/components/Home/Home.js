import React, { useEffect, useContext, useState,createContext } from 'react'
import "./style.css"
import axios from "axios";
import { userContext } from "../../App"
import { Navigate, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CreatePost from '../CreatePost/main';
import Posts from '../Posts/Posts';
import OnePost from '../OnePost/OnePost';
import { dataContext } from '../Main/Main';
function Home() {
    
    const navigate = useNavigate();
    const { token, userId, checkValue} = useContext(userContext);
    const { data, setData, dataFollowing ,setDataFollowing, setSelected, selected} = useContext(dataContext);

    const [islike, setIsLike] = useState(false);
    const [commentData, setCommentData] = useState(null);
    const [imageUser, setImageUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    function compareDates(a, b) {
        const dateA = new Date(convertDateFormat(a.datePost));
        const dateB = new Date(convertDateFormat(b.datePost));
        return dateB - dateA; // Sort in descending order (latest date first)
    }

    function convertDateFormat(dateString) {
        const parts = dateString.split(/[\s/:\s]/);
        return `${parts[1]}/${parts[0]}/${parts[2]} ${parts[3]}:${parts[4]}`;
    }

    const getAllPosts=()=>{
       /*  axios.get("https://friendly-29oc.onrender.com/posts",config).then((result) => {
            setData(result.data.posts);
            
        }).catch((err) => {
            if(err.response.status === 403){
                navigate("/login");
                localStorage.clear();
            }
        }); */
        axios.get(`https://friendly-29oc.onrender.com/users/follow/user/${userId}`,config).then((result) => {
            result.data.posts.sort(compareDates);
            setDataFollowing(result.data.posts);
        }).catch((err) => {
            if(err.response.status === 403){
                navigate("/login");
                localStorage.clear();
            }
        });

        axios.get("https://friendly-29oc.onrender.com/posts",config).then((result) => {
            result.data.posts.sort(compareDates);
            setData(result.data.posts);
            
        }).catch((err) => {
            if(err.response.status === 403){
                navigate("/login");
                localStorage.clear();
            }
        });  
        
         
    }
    useEffect(()=>{
    getAllPosts();
    axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
      localStorage.setItem("InfoMe",JSON.stringify(result.data.user));
    }).catch((err) => {
      
    });
    },[]);

  return (
        <div className='home-contenter'>
        <div className={!checkValue? 'nav-bar-home': 'nav-bar-home-night'}>
            <div className={selected === "home" ? 'home-main-selected': 'home-main' } onClick={()=>{
                setSelected("home");
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M10 12h4v4h-4z" /></svg>
            Home
            </div>
            <div className={selected === "explore" ? 'explore-main-selected': 'explore-main' } onClick={()=>{
                setSelected("explore");
                
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-edge" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.978 11.372a9 9 0 1 0 -1.593 5.773" /><path d="M20.978 11.372c.21 2.993 -5.034 2.413 -6.913 1.486c1.392 -1.6 .402 -4.038 -2.274 -3.851c-1.745 .122 -2.927 1.157 -2.784 3.202c.28 3.99 4.444 6.205 10.36 4.79" /><path d="M3.022 12.628c-.283 -4.043 8.717 -7.228 11.248 -2.688" /><path d="M12.628 20.978c-2.993 .21 -5.162 -4.725 -3.567 -9.748" /></svg>
                Explore
            </div>

            <div className={selected === "trundle" ? 'trundle-main-selected': 'trundle-main' } onClick={()=>{
                setSelected("trundle");
                navigate("/trundle")
                
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-film" viewBox="0 0 18 18">
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
            </svg>
                Trundle
            </div>
        </div>
        <CreatePost/>

        <Posts/>
        
        </div>
    

  )
}

export default Home