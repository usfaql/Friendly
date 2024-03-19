import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import axios from "axios";
import { userContext } from "../../App"
import { Navigate, useNavigate } from 'react-router-dom';
import { dataContext } from '../Main/Main';

const { initializeApp } = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } = require("firebase/storage");
  
  const firebaseConfig = {
    apiKey: "AIzaSyCYj7agxninbQcoLIQ130oy9Lcy5bGiV8c",
    authDomain: "frindly-d4395.firebaseapp.com",
    projectId: "frindly-d4395",
    storageBucket: "frindly-d4395.appspot.com",
    messagingSenderId: "55025000747",
    appId: "1:55025000747:web:946b40b554b337149c256e",
  };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage();

function CreatePost() {
    const navigate = useNavigate();
    const [content,setContent] = useState("");
    const  [postDetails, setPostDetails] = useState({})
    const [imageUser, setImageUser] = useState(null);
    const { token, userId, checkValue} = useContext(userContext);
    const {  data, setData } = useContext(dataContext);
    const [ImagePost, setImagePost] = useState({});
    const [trundleVideo , setTrundleVideo] = useState({})
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('post');
    const [limitVideo, setLimitVideo] = useState(false);
    const [imageUrlForIcon,setImageUrlForIcon]= useState(null);
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
  
    useEffect(()=>{
        axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
            setImageUser(result.data.user.image);
        }).catch((err) => {
            
        });
    },[]);
    
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
      };
  return (
    <div className={!checkValue? 'createPost-div': 'createPost-div-night'}>
    <img src={`${imageUser}`} style={{width:"48px", height:"48px", marginLeft:"10px",border:"0", borderRadius:"32px"}}/>
    <div className='contener-textarea-img'> 
    {limitVideo && <> <div className='error-video-length'>The video must be less than 31 seconds</div></>}
    <div style={{display:"flex",gap:"10px", justifyContent:"start", marginTop:"10px", color:"white"}}>
      <label style={{backgroundColor:"#303841",padding:"5px" , borderRadius:"4px"}}>
        <input
          type="radio"
          value="post"
          checked={selectedOption === 'post'}
          onChange={handleOptionChange}
        />
        Post
      </label>
      <label style={{backgroundColor:"#303841",padding:"5px" , borderRadius:"4px"}}>
        <input
          type="radio"
          value="trundle"
          checked={selectedOption === 'trundle'}
          onChange={handleOptionChange}
        />
        Trundle
      </label>
      
    </div>
    <textarea className={!checkValue?'input-content':'input-content-night'} placeholder='what Think?' value={content} id='content' onChange={(e)=>{
        setContent(e.target.value);
    }} />
    {imageUrlForIcon && 
      <div style={{display:"flex", justifyContent:"center" ,borderRadius:"4px", marginTop:"2px" ,height:"50vh"}}>
        <img src={imageUrlForIcon} style={{minWidth:"100%" ,borderRadius:"4px", marginTop:"2px" ,height:"100%"}}/>
      </div>
    }
        <div className='contenter-input-image' style={{textAlign:"left"}}>
            <div id='img-post-btn' style={{display:"flex", justifyContent:"space-between"}}>
                
           
            <div className='input-image'>
            
            <label htmlFor="img" className="custom-file-input-post">
            {selectedOption === "post"? 
            <> 
            <i className={ImagePost.name? 'gg-image-upload': 'gg-image'}></i>
            <input type="file" id="img" name="img"  style={{ display: "none" }}   accept="image/*"  onChange={(e)=>{
                const file = e.target.files[0];

                if (file) {
                    setImagePost(file);
                    setImageUrlForIcon(URL.createObjectURL(file));
                    console.log(file);
                }else{
                  setImageUrlForIcon(null)
                }
                
            }}/>
            
            </>
            : 
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
            </svg>
            <input type="file" id="img" name="img"  style={{ display: "none" }}  accept="video/*" onChange={(e)=>{
                const file = e.target.files[0];
                

                if (file) {
                  const video = document.createElement('video');
                  video.src = URL.createObjectURL(file);
                  video.onloadedmetadata = () => {
                    console.log(video.duration);
                    if (video.duration > 35) {
                      setLimitVideo(true);
                      
                    } else {
                      setLimitVideo(false);
                      setTrundleVideo(file);
                    }
                  };
                    
                }else{
                    
                }
            }}/></>
            
            }   

              </label>
            </div>
            <button className={ selectedOption === "post" && content || ImagePost.name || trundleVideo.name ? 'post-btn' : 'block-post-btn'}
        onClick={(e)=>{
          e.preventDefault()
          if(content || ImagePost.name){
          if(ImagePost.name){
            console.log("imageFile", ImagePost);
            const storageRef = ref(storage, `${ImagePost.name}`);
            const uploadTask = uploadBytesResumable(storageRef, ImagePost);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                document.querySelector("#myProgress").style.display = "block";
                const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.querySelector("#myBar").style.width = `${progress}%`
                document.querySelector("#img").value = "";
                document.querySelector("#content").value = "";
                document.querySelector("#img-post-btn").style.display = "none"
                setContent("");
              },
              (error) => {
                console.error('Error uploading file:', error);
              },
              () => {
                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    axios.post("https://friendly-29oc.onrender.com/posts/create", {content, author:userId, image: downloadURL},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then((result) => {
                        document.querySelector("#myProgress").style.display = "none";
                        document.querySelector("#img-post-btn").style.display = "block";
                       console.log("post added successfully");
                       console.log("result from create post", result);
                       // ?/ spread array [result , ]
                       setData([ ...data,result.data.data])
  
                }).catch((err) => {
                    console.log("error from create post" , err);
                });
                setImagePost(null)
                });
              }
            );
        }else{
            console.log(content,userId);
            axios.post("https://friendly-29oc.onrender.com/posts/create", {content, author:userId, image:""},{
                headers: {
                    Authorization: `Bearer ${token}`
                }}).then((result) => {
                    console.log("result from create post", result);
                     setData([ ...data,result.data.data ])
                    setContent("");

            }).catch((err) => {
                console.log("error from create post" , err);
            });
        }
          }else if(trundleVideo.name){
            const storageRef = ref(storage, `/${userId}/${trundleVideo.name}`);
            const uploadTask = uploadBytesResumable(storageRef, trundleVideo);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                document.querySelector("#myProgress").style.display = "block";
                const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.querySelector("#myBar").style.width = `${progress}%`
                document.querySelector("#img").value = "";
                document.querySelector("#content").value = "";
                document.querySelector("#img-post-btn").style.display = "none"
                setContent("");
              },
              (error) => {
                console.error('Error uploading file:', error);
              },
              () => {
                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    axios.post("https://friendly-29oc.onrender.com/trundle/create", {content, author:userId, video: downloadURL},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }}).then((result) => {
                        document.querySelector("#myProgress").style.display = "none";
                        document.querySelector("#img-post-btn").style.display = "block";
                       console.log("Trundle added successfully");
                       console.log("result from create post", result);
  
                }).catch((err) => {
                    console.log("error from create post" , err);
                });
                setImagePost(null)
                });
              }
            );
        
          }
    }}>Publish</button>
             </div>
                <div id="myProgress">
                <div id="myBar"></div>
                </div>

        </div>
        
    </div>
    
    
    </div>
  )
}

export default CreatePost