import React, { useEffect, useState, useContext } from 'react'
import axios, { all } from 'axios';
import { userContext } from "../../App"
import { useNavigate } from 'react-router-dom';
function NavbarV() {
    const navigate = useNavigate();
    const { token, userId, checkValue} = useContext(userContext);
    const infoMe = JSON.parse(localStorage.getItem("InfoMe"));
    const [allUser, setAllUser] = useState(null);
    const [following, setFollowing] = useState(null);
    const [follower, setFollower] = useState(null);
    const [friend, setFriend] = useState(null);
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    };
    useEffect(()=>{
        axios.get(`https://friendly-29oc.onrender.com/users/`, config).then((result) => {
            setAllUser(result.data.Users);
        }).catch((err) => {
            
        });
    axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
        setFollowing(result.data.user.following);
        setFollower(result.data.user.follower);
        }).catch((err) => {
          
    })
    },[])
    useEffect(() => {
        if (following && follower) {
            // قم بإنشاء قائمة جديدة للأصدقاء
            const newFriends = following.filter(followingUser => {
                // قم بالتحقق مما إذا كان المستخدم مشتركًا في قائمة 'follower'
                return follower.some(followerUser => followingUser._id === followerUser._id);
            });
            // حدث مصفوفة 'friends' بالقائمة الجديدة
            setFriend(newFriends);
        }
    }, [following, follower]);
  return (
    <div className='contenter-nav'>
        
        <div className={!checkValue? 'nav-bar': 'nav-bar-night'} style={{display: allUser?.length ? "block":"none"}}>
            <div style={{fontWeight:"bold", textAlign:"left", marginLeft:"10px", marginBottom:"10px", paddingTop:"10px"}}>Suggested For you</div>
            <div className={!checkValue? 'line': 'line-night'} ></div>
            <div style={{width: "100%"}}>
                {allUser && allUser.length > 0 && allUser.map((user, index) => {
                    if (userId && user._id === userId) {
                        // Skip rendering if the user is the current user
                        setAllUser(allUser.filter(u => u._id !== user._id));
                        return null;
                    } else if (infoMe && infoMe.following.some(idUser => idUser._id === user._id)) {
                        // Skip rendering if the current user is already following this user
                        setAllUser(allUser.filter(u => u._id !== user._id));
                        return null;
                    }
                
                    return (
                        <div key={index} onClick={() => {
                            localStorage.setItem("userIdG", user._id);
                            navigate("/profile");
                        }}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px", marginLeft: "5px", padding: "5px", textAlign: "center", placeItems: "center", gap: "10px" }}>
                                <div style={{ display: "flex", textAlign: "center", placeItems: "center", gap: "5px" }}>
                                    <img src={`${user.image}`} style={{ width: "48px", borderRadius: "24px" }} alt="User Avatar" />
                                    <div style={{ fontWeight: "bold" }}>{user.firstName}</div>
                                </div>
                                <button className='btn-follow'>Follow</button>
                            </div>
                            <div className={!checkValue ? 'line' : 'line-night'}></div>
                        </div>
                    );
                })}
                {allUser && allUser.length === 0 && <div>No users to display</div>}
            </div>
        </div>

        <div className={!checkValue? 'nav-bar': 'nav-bar-night'} style={{display: friend?.length ? "block":"none"}}>
            <div style={{fontWeight:"bold", textAlign:"left", marginLeft:"10px", marginBottom:"10px", paddingTop:"10px"}}>My Friend</div>
            <div className={!checkValue? 'line': 'line-night'} ></div>
            <div style={{width: "100%"}}>
                {friend && friend.length > 0 && friend.map((user, index) => {

                    return (
                        <div key={index} onClick={() => {
                            localStorage.setItem("userIdG", user._id);
                            navigate("/profile");
                        }}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px", marginLeft: "5px", padding: "5px", textAlign: "center", placeItems: "center", gap: "10px" }}>
                                <div style={{ display: "flex", textAlign: "center", placeItems: "center", gap: "5px" }}>
                                    <img src={`${user.image}`} style={{ width: "48px", borderRadius: "24px" }} alt="User Avatar" />
                                    <div style={{ fontWeight: "bold" }}>{user.firstName}</div>
                                </div>
                                <button className='btn-follow'>Message</button>
                            </div>
                            <div className={!checkValue ? 'line' : 'line-night'}></div>
                        </div>
                    );
                })}
                
            </div>
        </div>
    </div>
  )
}

export default NavbarV
