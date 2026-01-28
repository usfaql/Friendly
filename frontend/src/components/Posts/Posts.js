import React, { useEffect, useContext, useState, createContext } from 'react';
import "./style.css"
import axios from "axios";

import { userContext } from "../../App"
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg'
import { dataContext } from '../Main/Main';
export const postIdContext = createContext();
function Posts() {
    const navigate = useNavigate();
    const { token, userId , checkValue} = useContext(userContext);
    const { data, setData , dataFollowing,setDataFollowing, selected} = useContext(dataContext);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editAllow, setEditAllow] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [contentPostAfterEdit, setContentPostAfterEdit] = useState('');
    const openModal = (postId) => {
        setSelectedPostId(postId);
        setModalVisible(true);
      };
    
      const closeModal = () => {
        setSelectedPostId(null);
        setModalVisible(false);
      };
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
    data.sort(compareDates);
    let dataPost = [];
    selected === "home" ? dataPost = dataFollowing : dataPost = data;


    return(
    <div>
    
    {dataPost ?  dataPost.map((post, i)=>{
        
    
        const handleImageLoad = () => {
            setLoading(false); // Set loading to false once the image is loaded
        };
        
            const searchid = async()=>{
                if(selected === "home"){
                    axios.get(`https://friendly-29oc.onrender.com/posts/${post._id}/like`,config).then((result) => {
                        axios.get(`https://friendly-29oc.onrender.com/users/follow/user/${userId}`,config).then((results) => {
                           results.data.posts.sort(compareDates);
                           setDataFollowing(results.data.posts);
                       }).catch((err) => {
                       }); 
                    }).catch((err) => {

                    });
                }else{
                    axios.get(`https://friendly-29oc.onrender.com/posts/${post._id}/like`,config).then((result) => {
                        axios.get("https://friendly-29oc.onrender.com/posts",config).then((result) => {
                        setData(result.data.posts);
            
                    }).catch((err) => {
                        if(err.response.status === 403){
                        navigate("/login");
                        localStorage.clear();
                    }
                    });  
                    }).catch((err) => {

                    });
                }
                    
               
            };

        let hashtag = post.content.match(/(#)\w+/g);
        
        const postContentReplace= hashtag ? post.content.replace(/(#)\w+/g,(e)=> `<a id="hashtag" href='search/${e.replace("#", "")}'>${e}</a>`) : post.content;

        const dateParts = post.datePost.split(/[\/ :]/);
        const endDate = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]));
        const now = new Date();
        const difference = now - endDate;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        let dateNow = '';


        if (years) {
            dateNow = `${years} year${years > 1 ? 's' : ''} ago`;
        } else if (months) {
            dateNow = `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days) {
            dateNow = `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours) {
            dateNow = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes) {
            dateNow = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (seconds) {
            dateNow = `just now`;
        } else {
            dateNow = `just now`;
        }
        

        return(
            <div  className={!checkValue?'contenter-post' : 'contenter-post-night'}>
                
                <div className='containing-top-post'>
                    <div className='containing-photo-username' onClick={(e)=>{
                       localStorage.setItem("userIdG", post.author._id);
                        navigate("/profile");
                    }}>
                    <img style={{width:"48px" , borderRadius:"24px"}} src={post.author.image}/>
                    <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"start"}}>
                        <div className='name-user'>{post.author.firstName + " "+ post.author.lastName}</div>
                        <h5 style={{opacity:"0.7", fontWeight:"normal"}}>{dateNow}</h5>
                        
                    </div>
                    </div>
                </div>
                {/* End Bar  */}
                {/* Start line */}
                <div className={!checkValue? 'line' : 'line-night'}></div>
                {/* End line */}
                
                {/* Start Div Content Post */}
                <div className={!checkValue? 'content-post': 'content-post-night'} dangerouslySetInnerHTML={{
                    __html: postContentReplace
                  }}></div>
                   
                
                <div>
                    {
                    post.image && <div style={{  width: "98%",marginLeft:"1%", height: "100%" }}>
                    {loading && (
                    <div
                    style={{
                    
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    
                    }}
                    >
                    <div class="loader"></div>
                </div>
                    )}
                    {post.image  && (
                      <img
                        src={post.image}
                        style={{
                          maxWidth: "100%",
                          justifyContent: "center",
                          placeItems: "center",
                          maxHeight: "80%",
                          borderRadius: "10px",
                        }}
                        onLoad={handleImageLoad}
                      />
                    )}

    </div> }
                
                </div>
                {/* End Div Content Post */}

                {/* Start Show Count Like % Comments in Post */}
                <div style={{textAlign:"left" , margin:"1% 0px 0px 2%", color:"rgb(150,150,150)", fontSize:"13px"}}>{post.likes.length} Like  {post.comments.length} Comments</div>
                {/* End Show Count Like % Comments in Post */}

                {/* Start line */}
                <div className={!checkValue? 'line' : 'line-night'}></div>
                {/* End line */}
                
                {/*Start A bar containing three buttons to interact with the post */}
                
                <div className='bottom-bar-post'>

                    {/* Start The like button in the post */}
                    
                    <div className={!checkValue? 'interact-button': 'interact-button-night'} onClick={()=>{ 
                        searchid()
                    }}>

                        {
                         post.likes.includes(userId) ? <>
                         <svg xmlns="http://www.w3.org/2000/svg" 
                         class="icon icon-tabler icon-tabler-thumb-up-filled" width="32" height="32" 
                         viewBox="0 0 24 24" stroke-width="2" stroke="#2a86ff" fill="none" 
                         stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" stroke-width="0" fill="#2a86ff" /><path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" stroke-width="0" fill="#2a86ff" /></svg>
                        </>:
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        class="icon icon-tabler icon-tabler-thumb-up" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="#2a86ff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
                        }
                        
                    </div>
                    {/* End The like button in the post */}
                    
                    
                        
                    
                    {/* Start The Comment button in the post */}
                    <div className='interact-button comment' onClick={(e)=>{
                        localStorage.setItem("postId", post._id);
                        navigate(`/post/${post._id}`)
                        
                    }}>
                        <i className="gg-comment"></i>
                    </div>
                    {/* End The Comment button in the post */}

                    {/* Start The Share button in the post */}
                
                    {/* End The Share button in the post */}
                </div>
               
                {/*End A bar containing three buttons to interact with the post */}
            </div>
            
        )
    } 
    )
    :
    <div style={{display:"flex", justifyContent:"center", margin:"25px"}}>
        <div class="loader"></div>
    </div>
    
    }

    </div>
    )
}

export default Posts