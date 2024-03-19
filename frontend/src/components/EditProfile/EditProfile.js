import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { userContext } from "../../App"
import "./style.css"
import { useNavigate } from 'react-router-dom';

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


function EditProfile() {
  const navigate = useNavigate();
    const { token, userId } = useContext(userContext);
    const [dataUser , setDataUser] = useState([]);

    const [firstName, setFirstName]= useState(dataUser.firstName);
    const [lastName, setLastName]= useState(dataUser.lastName);
    const [email, setEmail]= useState(dataUser.email);
    const [imageUser, setImageUser] = useState(dataUser.image);
    const [phoneNumber, setPhone]= useState(dataUser.phoneNumber);
    const [bio , setBio] = useState(dataUser.bio);
    const [editImage , setEditImage] = useState(null);
    const [loading, setLoading] = useState(null);
  console.log(dataUser.image);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    useEffect(()=>{
      axios.get(`https://friendly-29oc.onrender.com/users/${userId}`, config).then((result) => {
        setDataUser(result.data.user);
        setImageUser(result.data.user.image);
      }).catch((err) => {
        if(err.response.status === 403){
          navigate("/login");
          localStorage.clear();
      }
      });
    },[]);
   
  return (
    <div className='main-edit'>
      
      <div className='contener-edit-profile'>
        <div className='contener-info-edit-main'>
          <div className='contener-info-edit'>

          
          <div className='img-name-info'>
            <div className='contenter-image-add'>
            <img className='image-profile' src={`${imageUser}`}/>
           
            <label htmlFor="fileInput" className="custom-file-input">
              <span>Edit</span>
              <input type="file" id="fileInput" style={{ display: "none" }} accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditImage(file);
                     console.log("Image Path In Input =>", file);
                  } else {
                    
                  }
                }}
              />
            </label>
            </div>          
            
            <div>{dataUser.firstName +" "+ dataUser.lastName}</div>
          </div>
          <div>
            <button className={!loading? 'btn-open-profile': 'btn-open-profile-block'} onClick={()=>{
              if(editImage){
                console.log(editImage.type);
                const storageRef = ref(storage, `/${userId}/profileImage`);
                const uploadTask = uploadBytesResumable(storageRef,editImage);

                uploadTask.on("state_changed", (snapshot)=>{
                    setLoading(`Please Wait.. (${(snapshot.bytesTransferred / snapshot.totalBytes) * 100} %)`)
                }, (error)=>{

                }, ()=>{
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    axios.put(`https://friendly-29oc.onrender.com/users/${userId}`, {firstName, lastName,email, phoneNumber, image:`${downloadURL}`,bio},config).then((result) => {
                      console.log("Update Data User Successfully");
                      navigate(-1)
                    }).catch((err) => {
                      console.log("Error =>", err);
                    });
                  }).catch((err) => {
                    
                  });
                })
              }else{
                  axios.put(`https://friendly-29oc.onrender.com/users/${userId}`, {firstName, lastName,email, phoneNumber, bio},config).then((result) => { 
                    console.log("Update Data User Successfully"); 
                    navigate(-1) 
                  }).catch((err) => { 
                    console.log("Error =>", err);
                  }); 
            }
            }}>{!loading?'Save Change': `${loading}`}</button>
          </div>
          </div>
        </div>
        <div style={{display:"flex", flexDirection:"column",placeItems:"center"}}>
          <div style={{textAlign:"start", marginLeft:"20px", color:"rgb(160,160,160)",fontSize:"18px", width:"50%"}}>Personal details</div>
          <div className='line' style={{maxWidth:"50%"}}></div>
        </div>
        
        <div className='contenter-input'>
          <div className='label-and-input'>
          <div>
            <div className='label'>First Name:</div>
            <input id='first-name' className='input-edit' defaultValue={dataUser.firstName} onChange={(e)=>{
              setFirstName(e.target.value);
            }}/>
          </div>
          <div>
            <div className='label'>Last Name:</div>
            <input id='last-name' className='input-edit' defaultValue={dataUser.lastName} onChange={(e)=>{
              setLastName(e.target.value);
            }}/>
          </div>
          
        </div>

        <div className='label-and-input'>
        <div>
          <div className='label'>Email:</div>
          <input id='email' className='input-edit' defaultValue={dataUser.email} onChange={(e)=>{
            setEmail(e.target.value);
          }}/>
        </div>
        <div>
          <div className='label'>Phone:</div>
          <input id='phone' className='input-edit' defaultValue={dataUser.phoneNumber} onChange={(e)=>{
            setPhone(e.target.value);
          }}/>
          </div>
        </div>
        <div className='label'>Bio:</div>
        <div className='label-and-input-bio'>
           
          <textarea type='text' id='bio' className='input-edit bio' maxLength={"55"} defaultValue={dataUser.bio} onChange={(e)=>{
            setBio(e.target.value)
          }}/>
        </div>
        </div>

      </div>
    </div>
  )
}

export default EditProfile