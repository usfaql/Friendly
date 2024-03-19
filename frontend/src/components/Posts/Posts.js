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
    const [limitShowPost ,setLimitShowPost] = useState(3);
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
        
      if (i < limitShowPost) {
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


         
        return(
            <div  className={!checkValue?'contenter-post' : 'contenter-post-night'}>
                {/* <h1>POSTS</h1> */}
                {/* A bar containing a photo and username */}
                <div className='containing-top-post'>
                    <div className='containing-photo-username' onClick={(e)=>{
                       localStorage.setItem("userIdG", post.author._id);
                        navigate("/profile");
                    }}>
                    <img style={{width:"48px" , borderRadius:"24px"}} src={post.author.image}/>
                    <div style={{display: "flex", flexDirection:"column"}}>
                        <div className='name-user'>{post.author.firstName + " "+ post.author.lastName}</div>
                        <div>{post.datePost}</div>
                        
                    </div>
                    </div>

                    <div style={{display : 'flex', flexDirection:"column"}}>

                    {post._id === userId && <button id={`${post._id}`} className={!checkValue? 'menu': 'menu-night'} onClick={(e)=>{
                    
                    if(modalVisible){
                        closeModal()
                    }else{
                        openModal(post._id);
                    }


                }
                   }>
                    Menu
                    {/* <i class="gg-menu"></i> */}
                   </button>
                    }
                    

                {modalVisible && selectedPostId === post._id && (
                    <div id="id01" className="w3-modal" style={{ display: 'block' }}>
                    <div className="w3-modal-content">
                        <div className="w3-container">
                        <button onClick={()=>{
                            setEditAllow(true);
                        }}>Edit</button>
                        <button onClick={()=>{
                            axios.delete(`https://friendly-29oc.onrender.com/posts/${post._id}`,config).then((result) => {
                                axios.get("https://friendly-29oc.onrender.com/posts/", config).then((result) => {
                                    setData(result.data.posts);
                                }).catch((err) => {
                                    
                                });
                            }).catch((err) => {
                                
                            });
                        }}>Delete</button>
                        </div>
                    </div>
                    </div>
                )}
                </div>
                </div>
                
                {/* End Bar  */}
                {/* Start line */}
                <div className={!checkValue? 'line' : 'line-night'}></div>
                {/* End line */}
                
                {/* Start Div Content Post */}
                {editAllow &&  selectedPostId === post._id ? <> <input id={post._id} defaultValue={post.content} onChange={(e)=>{
                    setContentPostAfterEdit(e.target.value)
                }} /> <button onClick={()=>{
                    axios.put(`https://friendly-29oc.onrender.com/posts/${post._id}`, {content: contentPostAfterEdit}, config).then((result) => {
                        setModalVisible(false);
                        setEditAllow(false);
                    }).catch((err) => {
                        
                    });
                }}>Save</button></>: <div className={!checkValue? 'content-post': 'content-post-night'} dangerouslySetInnerHTML={{
                    __html: postContentReplace
                  }}></div>
                   }
                
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
                         viewBox="0 0 24 24" stroke-width="2" stroke="#00ADB5" fill="none" 
                         stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" stroke-width="0" fill="#00ADB5" /><path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" stroke-width="0" fill="#00ADB5" /></svg>
                        </>:
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        class="icon icon-tabler icon-tabler-thumb-up" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="#00ADB5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
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
    })
    :
    <di style={{display:"flex", justifyContent:"center", margin:"25px"}}>
        <div class="loader"></div>
    </di>
    
    }
     <div style={{padding:"10px" ,color:"#018b92",cursor:"pointer" }} onClick={() =>{
        setLimitShowPost(limitShowPost+3);
     
    

     }}>
    {limitShowPost > dataPost.length -1 ? "run out" : "Load More..."}
     </div>
    </div>
    )
}

export default Posts