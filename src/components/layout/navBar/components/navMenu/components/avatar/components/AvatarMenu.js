import { getEmail, getSessionID, getUserInfo, logout } from "../../../../../../../../utility/Session";
import React, { useEffect, useState } from "react";
import "./AvatarMenu.css";
import { useHistory } from "react-router-dom";
import { ACCOUNT } from "../../../../../../../../utility/Route";
import { getHost } from "../../../../../../../../utility/APIService";

export default function AvatarMenu () {

    const history = useHistory();
    const sessionID = getSessionID();

    const [data, setData] = useState({});

    useEffect(() => {
        getUserInfo().then(res => {
            setData(res.data);
        })
    }, [])

    const { image } = data; 

    return (
        <div className="AvatarMenu bg-white">
            <div className="row">
                <div className="col-lg-12">
                    <img src={getHost() + image} alt="" width="50px" height="50px"/>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">     
                <ul className="list">
                    <li className="listItem">
                        <p className="email"> {getEmail()}</p>
                    </li>
                    <li className="listItem">
                        <p id="myAccount" onClick={() => history.push(ACCOUNT + sessionID)}>Account</p>
                    </li>
                    <li className="listItem">
                        <p id="logout" onClick={()=> logout()}>Logout</p>
                    </li>
                    </ul>
                </div>
            </div>
        </div> 
    )
}