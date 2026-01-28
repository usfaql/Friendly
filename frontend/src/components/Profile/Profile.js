import React, { useEffect, useState, useContext, useRef } from 'react'
import "./style.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userContext } from "../../App"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import socketInit from '../socket.server';
function Profile() {
  const navigate = useNavigate();
  const { token, userId,checkValue } = useContext(userContext);
  const [nameUser, setNameUser] = useState(null);
  const [imageUser, setImageUser] = useState(null);
  const [bio, setBio]= useState(null);
  const [phone, setPhone] = useState(null);
  const [gender,setGender] = useState(null);
  const [country, setCountry]= useState(null);
  const infoMe = JSON.parse(localStorage.getItem("InfoMe"));


  const [toId , setToId] = useState(null);
  const [from , setFrom] = useState("");
  const [image, setImage] = useState("")
  const [imageMessage , setImageMessage] = useState(null);
  const [inputMessage , setInputMessage] = useState("");
  const reversChat = useRef(null);

  const [followingUsers, setFollwingUsers] = useState(null);
  const [followerUsers, setFollowerUsers] = useState(null);
  const [lengthFollower, setLengthFollower] = useState(null);
  const [lengthFollowing, setLengthFollowing] = useState(null);
  const [lengthPosts, setLengthPosts] = useState(null);
  const [dataPosts , setDataPost]= useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAllow, setEditAllow] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [contentPostAfterEdit, setContentPostAfterEdit] = useState('');
  const [follwing, setFollwing] = useState([]);
  const [userObject, setUserObject] = useState(null);
  const [show, setShow] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState("none");
  const [socket, setSocket] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [allMessages, setAllMessages] = useState(null);
  const [follower, setFollower] = useState(null);
  const [friend, setFriend] = useState(null);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseFollower = () => setShowFollowers(false);
  const handleShowFollower = () => setShowFollowers(true);
 
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
  {dataPosts && dataPosts.sort(compareDates)};

  useEffect(() => {
    const handleBackButton = () => {
      localStorage.setItem("userIdG", userId)
      window.location.reload()
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);
  useEffect(()=>{
    if(localStorage.getItem("userIdG") && localStorage.getItem("userIdG")!== userId){
      setToId(localStorage.getItem("userIdG"));
      axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
        setUserObject(result.data.user);
        setFollwing(result.data.user.following);
        setFollower(result.data.user.follower);
        }).catch((err) => {
          
        })
        axios.get(`https://friendly-29oc.onrender.com/users/${localStorage.getItem("userIdG")}`, config).then((result) => {
          setNameUser(result.data.user.firstName + " "+ result.data.user.lastName);
          setImageUser(result.data.user.image);
          setLengthFollower(result.data.user.follower.length);
          setLengthFollowing(result.data.user.following.length);
          setPhone(result.data.user.phoneNumber);
          setCountry(result.data.user.country);
          setGender(result.data.user.gender);
          setBio(result.data.user.bio);
          setFollwingUsers(result.data.following);
          setFollowerUsers(result.data.user.follower);
          axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${localStorage.getItem("userIdG")}`,config).then((result) => {
            result.data.posts.sort(compareDates);
            setDataPost(result.data.posts);
            setLengthPosts(result.data.posts.length);
          }).catch((err) => {
            
          });

        }).catch((err) => {
          if(err.response.status === 403){
            navigate("/login");
            localStorage.clear();
      }
    });
    }else{
      axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
        setNameUser(result.data.user.firstName + " "+ result.data.user.lastName);
        setImageUser(result.data.user.image);
        setLengthFollower(result.data.user.follower.length);
        setLengthFollowing(result.data.user.following.length);
        setPhone(result.data.user.phoneNumber);
        setCountry(result.data.user.country);
        setGender(result.data.user.gender);
        setBio(result.data.user.bio);
        setFollwingUsers(result.data.following)
        setFollowerUsers(result.data.follower);
        
        axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${userId}`,config).then((result) => {
          result.data.posts.sort(compareDates);
          setDataPost(result.data.posts);
          setLengthPosts(result.data.posts.length);
        }).catch((err) => {
          
        });

        
    }).catch((err) => {
      if(err.response.status === 403){
        navigate("/login");
        localStorage.clear();
    }
    });
    }
},[localStorage.getItem("userIdG")]);

const openModal = (postId) => {
  setSelectedPostId(postId);
  setModalVisible(true);
};

const closeModal = () => {
  setSelectedPostId(null);
  setModalVisible(false);
};


const [maxWidth, setMaxWidth] = useState('100%');

  function handleImageLoad(event) {
    setLoading(false);
    const { naturalWidth , naturalHeight } = event.target;
    if (naturalWidth === naturalHeight) {
      setMaxWidth('30%');
    }else{
      setMaxWidth('100%')
    }
  }


  useEffect(()=>{
    socket?.on('connect', ()=>{
        console.log(true)
    })
   
    return()=>{
        socket?.close();
        socket?.removeAllListeners();
    }
  },[socket]);
  
  
  useEffect(() => {
    const handleMessagePrivate = (data) => {
      setAllMessages(prevMessages => [...prevMessages, data]);
    };
    socket?.on("messagePrivate", handleMessagePrivate);
    return()=>{
      socket?.off("messagePrivate", handleMessagePrivate)
    }
  }, [socket]);
  
  
  const sendMessage = ()=>{
    const newMessage = {
      room: toId,
      from: userId,
      message: inputMessage,
      name: infoMe.firstName + " " + infoMe.lastName,
      image : infoMe.image,
      image_message: imageMessage,
      created_at: new Date()
    };
  
    socket?.emit("messagePrivate", newMessage);
  }

 
    useEffect(()=>{
      setAllMessages([])
      if(toId){
      axios.get(`https://friendly-29oc.onrender.com/users/message/${userId}/${toId}`, config).then((result)=>{
        setAllMessages(result.data.messages)
      }).catch((error)=>{
        console.error(error);
      })
    }
    },[toId]);
 

  
  const disconnectServer = ()=>{
    socket?.disconnect();      
  }

  useEffect(()=>{
    if(showMessagePopup === "block"){
        if(reversChat.current){
            reversChat.current.scrollTop = reversChat.current.scrollHeight;
        };
    }
},[allMessages?.length])

  useEffect(() => {
      if (follwing && follower) {
          // قم بإنشاء قائمة جديدة للأصدقاء
          const newFriends = follwing.filter(followingUser => {
              // قم بالتحقق مما إذا كان المستخدم مشتركًا في قائمة 'follower'
              return follower.some(followerUser => followingUser._id === followerUser._id);
          });
          // حدث مصفوفة 'friends' بالقائمة الجديدة
          setFriend(newFriends);
      }
  }, [follwing, follower]);

  return (
    <div className='contenter-profile-page'>
      <div className='chat-popup' style={{display: showMessagePopup, backgroundColor : checkValue? "#1e1f24" : "white", color:checkValue? "white" : "black" ,
      border:checkValue? "1px solid #c7cad0":"1px solid #2f3239", borderBottom:"0"}}>
          <div className='title-chat'>
            <div style={{display:"flex", alignItems:"center", color:"white"}}>
              <h4>{nameUser}</h4>
            </div>
            <div style={{display:"flex", alignItems:"center", padding:"5px"}} onClick={()=>{
              disconnectServer();
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16" onClick={()=>{setShowMessagePopup("none")}}>
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg>
            </div>
            
          </div>

          <div className='body-message'  ref={reversChat}>
            {allMessages?.map((e)=>{
              if(e.from !== userId){
                const endDate = new Date(e.created_at);
                const now = new Date();
                const difference = now - endDate;
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor(difference / (1000 * 60));
                const seconds = Math.floor(difference / 1000);
                let dateNow = '';
                if(days){
                    dateNow = `${days} days ago`;
                }else if(hours){
                    dateNow = `${hours} hour ago`;
                }else if(minutes){
                    dateNow = `${minutes} minutes ago`;
                }else if(seconds){
                    dateNow = `just now`;
                }else{
                    dateNow = `just now`;
                }
                return(
                <div style={{display:"flex", justifyContent:"end",textAlign:"end", padding:"5px", gap:"5px", margin:"0"}}>
                  <div style={{maxWidth:"70%"}}>
                  <h6>{e.name}</h6>
                  <h4 style={{backgroundColor:"#2a86ff",color:"white", padding:"10px",borderRadius:"6px 0 6px 6px",maxWidth:"100%",wordWrap:"break-word"}}>{e.message }</h4>
                  <h5 style={{opacity:"0.7", fontWeight:"normal"}}>{dateNow}</h5>
                  </div>
                    
                    <div style={{display:"flex", height:"100%",flexDirection:"column", justifyContent:"flex-start"}}>
                      <img src={imageUser} style={{width:"48px",borderRadius:"100%"}}/>
                    </div>
                  </div>
                )
              }
              if(e.from === userId){

                const endDate = new Date(e.created_at);
                const now = new Date();
                const difference = now - endDate;
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor(difference / (1000 * 60));
                const seconds = Math.floor(difference / 1000);
                let dateNow = '';
                if(days){
                    dateNow = `${days} days ago`;
                }else if(hours){
                    dateNow = `${hours} hour ago`;
                }else if(minutes){
                    dateNow = `${minutes} minutes ago`;
                }else if(seconds){
                    dateNow = `just now`;
                }else{
                    dateNow = `just now`;
                }
                return (
                  <div style={{display:"flex", justifyContent:"start",textAlign:"start", padding:"5px", gap:"5px", maxWidth:"100%", margin:"0"}}>
                      <div style={{display:"flex", height:"100%",flexDirection:"column", justifyContent:"flex-start"}}>
                      <img src={infoMe.image} style={{width:"48px",borderRadius:"100%"}}/>
                    </div>
                    <div style={{maxWidth:"70%"}}>
                    <h6>{e.name}</h6>
                    <h4 style={{backgroundColor:"#e0e0e0",color:"black", padding:"10px",borderRadius:"0 6px 6px 6px", maxWidth:"100%",wordWrap:"break-word"}}>{e.message}</h4>
                    
                    <h5 style={{opacity:"0.7", fontWeight:"normal"}}>{dateNow}</h5>
                  </div>
                    
                  </div>
                )
              }
              
             

            })}
          </div>
          <div className='input-box'>
            <textarea style={{minHeight:"90%",height:"90%", maxHeight:"90%", maxWidth:"80%", width:"80%", minWidth:"80%", border:checkValue? "1px solid #2f3239":"1px solid #c7cad0",borderRadius:"4px",fontSize:"16px", fontWeight:"550"
            ,backgroundColor:checkValue? "#27292f" :"white",
            
          }} onChange={(e)=>{
              setInputMessage(e.target.value);
            }} 
            value={inputMessage} />
            <button style={{border:"0", padding:"12px", width:"15%", backgroundColor:"#2a86ff", color:"white", borderRadius:"4px", cursor:"pointer"}} onClick={()=>{
              if(inputMessage){
                setInputMessage("");
                sendMessage();
              };
            }}>Send</button>
          </div>
      </div>
      <div className='profile-info'>
      <div className={!checkValue?'nav-bar-profile': 'nav-bar-profile-night'}>
            <div className="container" >
                <img src={`${imageUser}`} className='user-image-profile'/>
            </div>
            <div className="container-user-info">
            <div className='nameUser'>{nameUser}</div>
            </div>
            
            <div style={{marginTop:"5px", color:"#2a86ff", whiteSpace:"pre-line"}}>{bio}</div>

            <div className='container-info-profile' style={{display:"flex", flexDirection:"row", margin:"20px 0 0 0", justifyContent:"center", textAlign:"center", gap:"15px"}}>
                <div>
                <div>{lengthPosts}</div>
                <div>Post</div>
                </div>

                <div onClick={handleShowFollower}>
                <div>{lengthFollower}</div>
                <div>Followers</div>
                </div>

                <div onClick={handleShow}>
                <div>{lengthFollowing}</div>
                <div>Following</div>
                </div>

                
            </div>

            <div className={checkValue? 'line-night': "line"}  style={{marginBottom:"10px"}}></div>
            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px", marginBottom:"5px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
                <label>{phone}</label>
              </div>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px" , marginBottom:"5px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-ambiguous" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"/>
              </svg>
                <label>{gender}</label>
              </div>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px", marginBottom:"5px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
                <label>{country}</label>
              </div>
            </div>
            {localStorage.getItem("userIdG") === userId ?<><div className={checkValue ? "btn-open-profile-night" : "btn-open-profile"} onClick={()=>{
              navigate("edit");
            }}>Edit Profile</div> <div className='btn-logout-profile' onClick={()=>{
              axios.put(`https://friendly-29oc.onrender.com/users/${userId}/status`,{isOnline : false}, config).then((result) => {
                localStorage.clear();
                navigate("/login");
              }).catch((err) => {
                console.error(err);
              });
              
            }}>Logout</div>
            </>  : <>
            <div style={{display:"flex"}}>
            {<div className={follwing.some(idUser => idUser._id === localStorage.getItem("userIdG")) ? "btn-open-profile" : "btn-open-follow"} style={{width:"100%"}} onClick={()=>{
              axios.get(`https://friendly-29oc.onrender.com/users/${userId}/${localStorage.getItem("userIdG")}`, config)
              .then((result) => {
                if (follwing.some(idUser => idUser._id === localStorage.getItem("userIdG"))) {
                  const arrFollow = follwing.filter(idUser => idUser._id !== localStorage.getItem("userIdG"));
                  const arrFollower = followerUsers.filter(idUser => idUser._id !== userId);
                  setFollwing(arrFollow);
                  setFollowerUsers(arrFollower)
                  setLengthFollower(lengthFollower-1)

                } else {
                  setFollwing([...follwing, { _id: localStorage.getItem("userIdG") }]);
                  setFollowerUsers([...followerUsers, userObject]);
                  setLengthFollower(lengthFollower+1)

                }
              })
              .catch((err) => {
                console.error(err);
              });
               
            }}>{follwing.some(idUser => idUser._id === localStorage.getItem("userIdG")) ? "Unfollow" : "follow"} </div>}
            {friend?.some(idUser => idUser._id === localStorage.getItem("userIdG")) && <div className='message-btn' onClick={()=>{
              //navigate(`/${userId}/message/${localStorage.getItem("userIdG")}`)
              setSocket(socketInit({user_id : userId, token :token , room : localStorage.getItem("userIdG")}));
              setShowMessagePopup("block")

            }}>Message</div>}
            </div>
            </>}
        </div>
      </div>

      
      <div>
        
      </div>
      
      <div className='post-content-profile'>
      <div className='profile-info-phone'>
      <div className={!checkValue?'nav-bar-profile': 'nav-bar-profile-night'}>
            <div className="container" >
                <img src={`${imageUser}`} className='user-image-profile'/>
            </div>
            <div className="container-user-info">
            <div className='nameUser'>{nameUser}</div>
            </div>
            
            <div style={{marginTop:"5px", color:"#2a86ff", whiteSpace:"pre-line"}}>{bio}</div>

            <div className='container-info-profile' style={{display:"flex", flexDirection:"row", margin:"20px 0 0 0", justifyContent:"center", textAlign:"center", gap:"15px"}}>
                <div>
                <div>{lengthPosts}</div>
                <div>Post</div>
                </div>

                <div onClick={handleShowFollower}>
                <div>{lengthFollower}</div>
                <div>Followers</div>
                </div>

                <div onClick={handleShow}>
                <div>{lengthFollowing}</div>
                <div>Following</div>
                </div>

                
            </div>

            <div className={checkValue? 'line-night': "line"}  style={{marginBottom:"10px"}}></div>
            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px", marginBottom:"5px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
                <label>{phone}</label>
              </div>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px" , marginBottom:"5px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-ambiguous" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"/>
              </svg>
                <label>{gender}</label>
              </div>
              <div style={{display: 'flex',marginLeft:"10px", gap:"10px", marginBottom:"5px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
                <label>{country}</label>
              </div>
            </div>
            {localStorage.getItem("userIdG") === userId ?<><div className={checkValue ? "btn-open-profile-night" : "btn-open-profile"} onClick={()=>{
              navigate("edit");
            }}>Edit Profile</div> <div className='btn-logout-profile' onClick={()=>{
              localStorage.clear();
              navigate("/login");
            }}>Logout</div>
            </>  : <>
            <div style={{display:"flex"}}>
            {<div className={follwing.some(idUser => idUser._id === localStorage.getItem("userIdG")) ? "btn-open-profile" : "btn-open-follow"} style={{width:"100%"}} onClick={()=>{
              axios.get(`https://friendly-29oc.onrender.com/users/${userId}/${localStorage.getItem("userIdG")}`, config)
              .then((result) => {
                if (follwing.some(idUser => idUser._id === localStorage.getItem("userIdG"))) {
                  const arrFollow = follwing.filter(idUser => idUser._id !== localStorage.getItem("userIdG"));
                  const arrFollower = followerUsers.filter(idUser => idUser._id !== userId);
                  setFollwing(arrFollow);
                  setFollowerUsers(arrFollower)
                  setLengthFollower(lengthFollower-1)

                } else {
                  setFollwing([...follwing, { _id: localStorage.getItem("userIdG") }]);
                  setFollowerUsers([...followerUsers, userObject]);
                  setLengthFollower(lengthFollower+1)

                }
              })
              .catch((err) => {
                console.error(err);
              });
               
            }}>{follwing.some(idUser => idUser._id === localStorage.getItem("userIdG")) ? "Unfollow" : "follow"} </div>}
            {friend?.some(idUser => idUser._id === localStorage.getItem("userIdG")) && <div className='message-btn' onClick={()=>{
              //navigate(`/${userId}/message/${localStorage.getItem("userIdG")}`)
              setSocket(socketInit({user_id : userId, token :token , room : localStorage.getItem("userIdG")}));
              setShowMessagePopup("block")

            }}>Message</div>}
            </div>
            </>}
        </div>
      </div>
      {dataPosts && dataPosts.map((post, i)=>{

               
        const searchidPost = async()=>{
          axios.get(`https://friendly-29oc.onrender.com/posts/${post._id}/like`,config).then((result) => {
            
              if(localStorage.getItem("userIdG") && localStorage.getItem("userIdG")!== userId){
                axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
                  setFollwing(result.data.user.following);
                  }).catch((err) => {
                    
                  });
                  axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${localStorage.getItem("userIdG")}`,config).then((result) => {
                      result.data.posts.sort(compareDates);
                      setDataPost(result.data.posts);
                    }).catch((err) => {
                      
                    });
                  
              }else{
                  axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${userId}`,config).then((result) => {
                    result.data.posts.sort(compareDates);
                    setDataPost(result.data.posts);
                  }).catch((err) => {
                  });
              }
          }).catch((err) => {
          });
        };

        let hashtag = post.content.match(/(#)\w+/g);
        
        const postContentReplace= hashtag ? post.content.replace(/(#)\w+/g,(e)=> `<a id="hashtag" href='search/${e.replace("#", "")}'>${e}</a>`) : post.content;
        const dateParts = post.datePost.split(/[\/ :]/);
        const endDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4]);
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
            <div className={!checkValue?'contenter-post' : 'contenter-post-night'}>
                {/* <h1>POSTS</h1> */}
                {/* A bar containing a photo and username */}
                <div className='containing-top-post'>
                    <div className='containing-photo-username'>
                    <img style={{width:"48px" , borderRadius:"24px"}} src={post.author.image}/>
                    <div style={{display: "flex", flexDirection:"column"}}>
                        <div className='name-user'>{post.author.firstName + " "+ post.author.lastName}</div>
                        <h5 style={{opacity:"0.7", fontWeight:"normal"}}>{dateNow}</h5>
                        
                    </div>
                    </div>

                    <div style={{display : 'flex', flexDirection:"column"}}>

                    {localStorage.getItem("userIdG") === userId && <>
                    <div id={`${post._id}`}  className={!checkValue? 'menu': 'menu-night'} onClick={(e)=>{
                      if(modalVisible){
                          closeModal();
                          setEditAllow(false)
                      }else{
                          openModal(post._id);
                      }
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2a86ff" class="bi bi-three-dots" viewBox="0 0 16 16">
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                    </svg>

                    </div>
                    </>}
                    

                {selectedPostId === post._id && (
                    <div id="id01" className="w3-modal" style={{ display: 'block', backgroundColor:"#17181c"}}>
                    <div className="w3-modal-content">
                        <div className="w3-container" style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                        <button style={{border:"0", padding:"5px", backgroundColor:"#2a86ff",color:"white", borderRadius:"4px", cursor:"pointer"}} onClick={()=>{
                            setEditAllow(true);
                        }}>Edit</button>
                        <button style={{border:"0", padding:"5px", backgroundColor:"#2a86ff",color:"white", borderRadius:"4px", cursor:"pointer"}} onClick={()=>{
                            axios.delete(`https://friendly-29oc.onrender.com/posts/${post._id}/${post.author._id}` ,config).then((result) => {
                              axios.get(`https://friendly-29oc.onrender.com/posts/search_1/${userId}`,config).then((result) => {
                                result.data.posts.sort(compareDates);
                                setDataPost(result.data.posts);
                                setLengthPosts(result.data.posts.length);
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
                }}></div>}
                
                <div>
                    {
     post.image && <div style={{  width: "98%",marginLeft:"1%", height: "100%" }}>
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
          <img src={require('../Image/loading.gif')} style={{width:"5%"}} alt="Loading..." />
        </div>
      )}
      {post.image && (
        <img
          src={post.image}
          onLoad={handleImageLoad}
          style={{
            maxWidth: maxWidth,
            justifyContent: "center",
            placeItems: "center",
            maxHeight: "80%",
            borderRadius: "10px",
          }}
          
        />
      )}

    </div> }
                
                </div>
                {/* End Div Content Post */}

                {/* Start Show Count Like % Comments in Post */}
                <div style={{textAlign:"left" , margin:"10px", color:"rgb(150,150,150)"}}>{post.likes.length} Like  {post.comments.length} Comments</div>
                {/* End Show Count Like % Comments in Post */}

                {/* Start line */}
                <div className={!checkValue? 'line' : 'line-night'}></div>
                {/* End line */}
                
                {/*Start A bar containing three buttons to interact with the post */}
                
                <div className='bottom-bar-post'>

                    {/* Start The like button in the post */}
                    
                  <div className={!checkValue? 'interact-button': 'interact-button-night'} onClick={()=>{ 
                        searchidPost()
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
    })
    }

      </div>

      <Modal show={show} onHide={handleClose} keyboard={false} >
              <Modal.Header closeButton style={{height:"10%", display:"flex", justifyContent:"space-between",alignItems:"center", borderBottom:"1px solid gray"}}>
                <Modal.Title style={{fontWeight:"bold", fontSize:"24px"}}>Following</Modal.Title>
                <Button variant="secondary" onClick={handleClose} style={{width:"fit-content", height:"fit-content",padding:"5px",fontSize:"24px", borderRadius:"4px", border:"0", backgroundColor:"transparent", color:"red"}}>
                  X
                </Button>
              </Modal.Header>
              <Modal.Body style={{height:"90%"}}>
                {followingUsers?.map((e,i)=>{

                  return <div style={{display:"flex", gap:"5px", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(140, 140, 140,0.4)", padding:"5px"}}>
                    <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                      <img src={e.image} style={{width:"48px", height:"48px", borderRadius:"32px"}}/>
                      <h3>{e.firstName} {e.lastName}</h3>
                    </div>
                    <div>
                      {localStorage.getItem("userIdG") && localStorage.getItem("userIdG")!== userId ? 
                      <button style={{padding:"5px", borderRadius:"4px", border:"0"}} onClick={()=>{
                        localStorage.setItem("userIdG", e._id);
                        navigate("/profile");
                        window.location.reload();
                      }}>Show</button>
                      : 
                      <button style={{padding:"5px", borderRadius:"4px", border:"0"}} onClick={()=>{
                        axios.get(`https://friendly-29oc.onrender.com/users/${userId}/${e._id}`,config).then((result) => {                      
                          if(i !== -1){
                          followingUsers.splice(i, 1);
                          setFollwingUsers([...followingUsers]);
                          }
                          
                        }).catch((err) => {
                                      
                        });
                      }}>Unfollow</button>
                      }
                    </div>
                  </div>
                })}
              </Modal.Body>
              
        </Modal>


        <Modal show={showFollowers} onHide={handleCloseFollower} keyboard={false} >
              <Modal.Header closeButton style={{height:"10%", display:"flex", justifyContent:"space-between",alignItems:"center", borderBottom:"1px solid gray"}}>
                <Modal.Title style={{fontWeight:"bold", fontSize:"24px"}}>Followers</Modal.Title>
                <Button variant="secondary" onClick={handleCloseFollower} style={{width:"fit-content", height:"fit-content",padding:"5px",fontSize:"24px", borderRadius:"4px", border:"0", backgroundColor:"transparent", color:"red"}}>
                  X
                </Button>
              </Modal.Header>
              <Modal.Body style={{height:"90%"}}>
                {followerUsers?.map((e,i)=>{
                  return <div style={{display:"flex", gap:"5px", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(140, 140, 140,0.4)", padding:"5px"}}>
                    <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                      <img src={e.image} style={{width:"48px", height:"48px", borderRadius:"32px"}}/>
                      <h3>{e.firstName} {e.lastName}</h3>
                    </div>
                    <div>
                      <button style={{padding:"5px", borderRadius:"4px", border:"0"}} onClick={()=>{
                        localStorage.setItem("userIdG", e._id);
                        navigate("/profile");
                        window.location.reload()
                      }}>Show</button>
                    </div>
                  </div>
                })}
              </Modal.Body>
              
        </Modal>
    </div>
  )
}

export default Profile