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

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(()=>{
    
    axios.get(`https://friendly-29oc.onrender.com/posts/search_2/${postId}`, config).then((result) => {
      setPost(result.data.post);
      setCommentData(result.data.post.comments);
      setLikeArray(result.data.post.likes);
    }).catch((err) => {
      console.log("Error ==>", err);
      /* if(err.response.status === 403){
        navigate("/login");
        localStorage.clear();
    } */
    })
  },[]);
    
  console.log(likeArray);
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
        console.log("Like Api =>", result);
        if(result.data.message === "Like Added"){
          setLikeArray([...likeArray, infoMe]);
        }else{
          setLikeArray(likeArray.slice(infoMe, 1))
        }
      })
      .catch((err) => {
        console.log("Error", err);
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
            <div>{post.datePost}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            id={`${post._id}`}
            style={{ width: "fit-content", height: "fit-content" }}
            onClick={(e) => {
              if (modalVisible) {
                closeModal();
              } else {
                openModal(post._id);
              }
            }}
          >
            Menu
            {/* <i class="gg-menu"></i> */}
          </button>

          {modalVisible && selectedPostId === post._id && (
            <div id="id01" className="w3-modal" style={{ display: "block" }}>
              <div className="w3-modal-content">
                <div className="w3-container">
                  <button
                    onClick={() => {
                      setEditAllow(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      axios
                        .delete(
                          `https://friendly-29oc.onrender.com/posts/${post._id}`,
                          config
                        )
                        .then((result) => {
                          axios
                            .get("https://friendly-29oc.onrender.com/posts/", config)
                            .then((result) => {
                              setPost(result.data.posts);
                            })
                            .catch((err) => {});
                        })
                        .catch((err) => {});
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* End Bar  */}
      {/* Start line */}
      <div className={checkValue? "line-night":"line"}></div>
      {/* End line */}

      {/* Start Div Content Post */}
      {editAllow && selectedPostId === post._id ? (
        <>
          {" "}
          <input
            id={post._id}
            defaultValue={post.content}
            onChange={(e) => {
              setContentPostAfterEdit(e.target.value);
            }}
          />{" "}
          <button
            onClick={() => {
              axios
                .put(
                  `https://friendly-29oc.onrender.com/posts/${post._id}`,
                  { content: contentPostAfterEdit },
                  config
                )
                .then((result) => {
                  console.log(result);
                  setModalVisible(false);
                  setEditAllow(false);
                })
                .catch((err) => {});
            }}
          >
            Save
          </button>
        </>
      ) : (
        <div className={!checkValue? 'content-post': 'content-post-night'}>{post.content}</div>
      )}

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
            console.log(likeArray.some((e) => e._id === userId));
          }}
        >
          {likeArray.some((e) => e._id === userId) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#4464AD"
              className="bi bi-hand-thumbs-up-fill"
              viewBox="0 0 16 16"
            >
              <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
            </svg>
          ) : (
            <svg
              xmlns={"http://www.w3.org/2000/svg"}
              width="24"
              height="24"
              fill="#4464AD"
              className="bi bi-hand-thumbs-up"
              viewBox="0 0 16 16"
            >
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
            </svg>
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
