import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from "axios";
import "./trundle.css"
import { userContext } from '../../App';
import { useNavigate } from 'react-router-dom';
function Trundle() {
    const navigate = useNavigate();
    const { token, userId, checkValue} = useContext(userContext);
    const [dataTrundle, setDataTrundle] = useState(null);
    const [controlVideo, setControlVideo] = useState("play");
    const [isMuted, setIsMuted] = useState(false);
    const [intData, setIntData] = useState(0);
    const videoRef = useRef(null);
  
    const playAndStop = () => {
      if (controlVideo === "play") {
        videoRef.current.play();
        setControlVideo("pause");
      } else {
        videoRef.current.pause();
        setControlVideo("play");
      }
    };

    const next = ()=>{
        console.log("IntData", dataTrundle[intData]);
        
        if(intData < dataTrundle.length-1){
            setIntData(intData + 1);
        }
    }
    const back = () =>{
        if(intData > 0){
            setIntData(intData - 1);
        }
    }
    const toggleMute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
      };
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(()=>{
        axios.get("https://friendly-29oc.onrender.com/trundle/", config).then((result) => {
            
            setDataTrundle(result.data.trundle);
        }).catch((err) => {
            if(err.response.data.code == 2){
                navigate("login")
            } 
            
        });
    },[]);
    console.log("Trundle =>", dataTrundle);
    const searchid = async()=>{
            axios.get(`https://friendly-29oc.onrender.com/trundle/${dataTrundle[intData]._id}/like`,config).then((result) => {
                axios.get("https://friendly-29oc.onrender.com/trundle/",config).then((result) => {
                setDataTrundle(result.data.trundle);
    
            }).catch((err) => {
                
            });  
            }).catch((err) => {
                console.log("Error", err);
            });
    };
  return (
    <div >
        <div style={{color:"#018b92", fontWeight:"bold", fontSize:"5vh" , height:"10vh" , justifyContent:"center", fontFamily:"cursive",alignItems:"center", display:"flex"}}>Trundle</div>
        <div style={{display :"flex" , height: "80vh",gap:"5%" ,justifyContent:"center", alignItems:"center"}}>

        
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill={checkValue ? "white" : "black"} class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16" onClick={back}>
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
        <div style={{position:"relative" , width:"500", height:"720"}}>
        <div style={{position:"absolute", left:"10px",top:"10px", display:"flex", gap:"5px"}}>
        <img style={{ borderRadius:"26px", width:"52px" , border:"2px solid #018b92"}} src={dataTrundle && dataTrundle[intData].author.image}/>
        <div style={{marginTop :"9px"}}>
            <div>
                <label style={{color:'white', marginTop:"10px", fontWeight:"bold"}}>{dataTrundle && dataTrundle[intData].author.firstName} </label>
                <label style={{color:'white', marginTop:"10px", fontWeight:"bold"}}>{dataTrundle && dataTrundle[intData].author.lastName} </label>
            </div>
        <label style={{color:'gray', marginTop:"10px", fontSize:"13px"}}>{dataTrundle && dataTrundle[intData].dateTrundle} </label>
        </div>
        
        </div>
        {/* like Button */}
        <div style={{position:"absolute", right:"4%" ,top :"72%", zIndex:5}} onClick={()=>{
            searchid()
        }}>
            
            
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
            <div>
                {dataTrundle && dataTrundle[intData].likes.includes(userId) ?
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    class="icon icon-tabler icon-tabler-thumb-up-filled" width="32" height="32" 
                    viewBox="0 0 24 24" stroke-width="2" stroke="#00ADB5" fill="none"  style={{ backgroundColor:"rgb(0,0,0,0.5)" , padding:"5px", borderRadius:"32px"}}
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" stroke-width="0" fill="#00ADB5" /><path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" stroke-width="0" fill="#00ADB5" /></svg> 
                :
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor:"rgb(0,0,0,0.5)" , padding:"5px", borderRadius:"32px"}} 
                    class="icon icon-tabler icon-tabler-thumb-up" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="#00ADB5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" /></svg>
                }
            </div>
                <label style={{color:"white", textShadow:"0 0px 5px black"}}>{dataTrundle && dataTrundle[intData].likes.length} Like</label>
            </div>
        </div>
        
        
        <div style={{position:"absolute", right:"4%" ,top :"85%", zIndex:5}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" style={{ backgroundColor:"rgb(0,0,0,0.5)" , padding:"10px", borderRadius:"32px"}} fill="white" class="bi bi-share" viewBox="0 0 19 16">
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
        </svg>
        </div>

        <div style={{position : "absolute", bottom: 10 , left:10 , zIndex: 4,borderRadius:"4px" ,backgroundColor:"black",width:"fit-content", height:"fit-content"}} onClick={toggleMute}>
          {isMuted ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-volume-mute-fill"  viewBox="0 0 16 16">
  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
  <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
  <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
</svg>}
        </div>
        <video style={{borderRadius:"15px", backgroundColor:"black"}} ref={videoRef} src={dataTrundle && dataTrundle[intData].video} width="400" height="700" controls ={false} onClick={playAndStop}>
        </video>
        
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill={checkValue ? "white" : "black"} class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16" onClick={next}>
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
        </svg>
        </div>
    </div>
  )
}

export default Trundle