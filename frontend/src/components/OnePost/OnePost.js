import React, { useEffect, useContext, useState } from "react";
import { userContext } from "../../App";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function OnePost() {
/*   const {data, setData} = useContext(dataContext); */
  const navigate = useNavigate();
  const { token, userId, checkValue } = useContext(userContext);
  const infoMes = localStorage.getItem("InfoMe");
  const infoMe = JSON.parse(infoMes)
  const [post, setPost] = useState(null);
  const postId = localStorage.getItem("postId");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAllow, setEditAllow] = useState(false);
  const [contentPostAfterEdit, setContentPostAfterEdit] = useState("");
  const [loading, setLoading] = useState(true);
  const [likeArray, setLikeArray] = useState([]);
  const [commentData , setCommentData]= useState([]);
  const [inputComment, setInputComment] = useState(null);
  const [dateNow , setDateNow] = useState("");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(()=>{
    
    axios.get(`https://friendly-29oc.onrender.com/posts/search_2/${postId}`, config).then((result) => {
      setPost(result.data.post);
      setCommentData(result.data.post.comments);
      setLikeArray(result.data.post.likes);

      const dateParts = result.data.post.datePost.split(/[\/ :]/);
      const endDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]);
      const now = new Date();
      const difference = now - endDate;
    
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);
      if (years) {
          setDateNow(`${years} year${years > 1 ? 's' : ''} ago`)
      } else if (months) {
        setDateNow(`${months} month${months > 1 ? 's' : ''} ago`);
      } else if (days) {
        setDateNow(`${days} day${days > 1 ? 's' : ''} ago`);
      } else if (hours) {
        setDateNow(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      } else if (minutes) {
        setDateNow (`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else if (seconds) {
        setDateNow(`just now`);
      } else {
        setDateNow(`just now`);
      }
    }).catch((err) => {
    
    })
  },[]);
    
  const openModal = (postId) => {
    setSelectedPostId(postId);
    setModalVisible(true);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    setModalVisible(false);
  };
  const handleImageLoad = () => {
    setLoading(false); // Set loading to false once the image is loaded
  };
  const searchid = () => {
    axios
      .get(`https://friendly-29oc.onrender.com/posts/${post._id}/like`, config)
      .then((result) => {
        if(result.data.message === "Like Added"){
          setLikeArray([...likeArray, infoMe]);
        }else{
          setLikeArray(likeArray.slice(infoMe, 1))
        }
      })
      .catch((err) => {
        console.error("Error", err);
      });
  };

  return (
    <div className="continer-post-comment">
    {post && 
     
      <>
      

    <div className={checkValue? "contenter-one-post-night": "contenter-one-post"}>
      {/* <h1>POSTS</h1> */}
      {/* A bar containing a photo and username */}
      <div className="containing-top-post">
        <div className="containing-photo-username">
          <img
            style={{ width: "48px", borderRadius: "24px" }}
            src={post.author.image}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="name-user">
              {post.author.firstName + " " + post.author.lastName}
            </div>
            <div>{dateNow}</div>
          </div>
        </div>
        
      </div>

      {/* End Bar  */}
      {/* Start line */}
      <div className={checkValue? "line-night":"line"}></div>
      {/* End line */}

      {/* Start Div Content Post */}

        <div className={!checkValue? 'content-post': 'content-post-night'} dangerouslySetInnerHTML={{
          __html: post.content.match(/(#)\w+/g) ? post.content.replace(/(#)\w+/g, (e) => `<a id="hashtag" href='/search/${e.replace("#", "")}'>${e}</a>`) : post.content
        }}></div>
      

      <div>
        {post.image && (
          <div
            style={{
              width: "98%",
              marginLeft: "1%",
              height: "100%",
            }}
          >
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the background color and opacity as needed
                }}
              >
                <img
                  src={require("../Image/loading.gif")}
                  style={{ width: "5%" }}
                  alt="Loading..."
                />
              </div>
            )}
            {post.image && (
              <img
                src={post.image}
                style={{
                  maxWidth: "100%",
                  justifyContent: "center",
                  placeItems: "center",
                  maxHeight: "100%",
                  padding: "10px",
                  borderRadius: "20px",
                }}
                onLoad={handleImageLoad}
              />
            )}
          </div>
        )}
      </div>
      {/* End Div Content Post */}

      {/* Start Show Count Like % Comments in Post */}
      <div
        style={{ textAlign: "left", margin: "10px", color: "rgb(150,150,150)" }}
      >
        {likeArray.length} Like {post.comments.length} Comments
      </div>
      {/* End Show Count Like % Comments in Post */}

      {/* Start line */}
      <div className={checkValue? "line-night":"line"}></div>
      {/* End line */}

      {/*Start A bar containing three buttons to interact with the post */}

      <div className="bottom-bar-post">
        {/* Start The like button in the post */}

        <div
          className="interact-button"
          onClick={() => {
            searchid();
          }}
        >
          
          {likeArray.some((e) => e._id === userId) ? (
            <svg xmlns="http://www.w3.org/2000/svg" 
             class="icon icon-tabler icon-tabler-thumb-up-filled" width="32" height="32" 
             viewBox="0 0 24 24" stroke-width="2" stroke="#2a86ff" fill="none" 
             stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" stroke-width="0" fill="#2a86ff" /><path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" stroke-width="0" fill="#2a86ff" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" 
            class="icon icon-tabler icon-tabler-thumb-up" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="#2a86ff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
                        
          )}
        </div>
        {/* End The like button in the post */}

        {/* Start The Comment button in the post */}
        <div className="interact-button comment" onClick={(e) => {}}>
          <i className="gg-comment"></i>
        </div>
        {/* End The Comment button in the post */}

        {/* Start The Share button in the post */}

        {/* End The Share button in the post */}
      </div>
      <div className={checkValue? "line-night":"line"}></div>
        <div className={!checkValue? "contenter-comment-array" : "contenter-comment-array-night"}>

        
        {commentData.map((e,i)=>{
          return(
          <div className="containing-comment-post">
          <div className="containing-photo-username">
            <img
              style={{ width: "48px", borderRadius: "24px",margin:"5px" }}
              src={e.commenter?.image}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="name-user">
                {e.commenter?.firstName + " " + e.commenter?.lastName}
              </div>
              <div style={{fontWeight:"bold",fontSize:"16px" ,textAlign:"start",padding:"5px"}}>{e?.comment}</div>
            </div>
          </div>
  
        </div>
        )
        })}
        </div>
      <div className={checkValue? "line-night":"line"}></div>
        <div className="contenter-comment-input">
          <div className="cont-img-input-comm">
          <img className="img-comment" src={`${infoMe.image}`}/>
          </div>
         
          <input className="input-comment" placeholder="comment..." value={inputComment} onChange={(e)=>{
            setInputComment(e.target.value);
          }}/>
          <button className="btn-send-comment" onClick={()=>{
            axios.post(`https://friendly-29oc.onrender.com/posts/${post._id}/comment`, {"comment":inputComment}, config).then((result) => {
              setInputComment("");
              setCommentData([...commentData, {comment: inputComment,commenter: infoMe}]) 
            }).catch((err) => {
              
            });
          }}>Send</button>
        </div>
 

      {/*End A bar containing three buttons to interact with the post */}
    </div>
    </>}</div>
    )
}

export default OnePost;
