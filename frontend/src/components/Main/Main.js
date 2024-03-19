import React, { createContext, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarV from "../NavbarVirtcal/NavbarV";
import NavbarR from "../NavbarVirtcalRight/NavbarR";
import Home from "../Home/Home";
import "./style.css"
import { userContext } from "../../App";
export const dataContext = createContext();

const Main = ()=>{
    const {checkValue} = useContext(userContext);
    const [data, setData] = useState([]);
    
    const [dataFollowing, setDataFollowing] = useState([]);
    const [selected, setSelected] = useState("home");

    return(
      <dataContext.Provider value={{data, setData, dataFollowing, setDataFollowing , selected, setSelected}}>
        <div className={!checkValue? 'main' : 'mainNight'}>
          
        <NavbarV/>
        <Home/>
        <NavbarR/>
      </div>
      </dataContext.Provider>
    )
}

export default Main