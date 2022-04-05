import AvatarMenu from "./components/AvatarMenu";
import './Avatar.css';
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../../../../../../utility/Session";
import { getHost } from "../../../../../../../utility/APIService";

export default function Avatar(props) { 

    const { isActive, setActive } = props;

    const [data, setData] = useState({});

    useEffect(() => {
        getUserInfo().then(res => {
            setData(res.data);
        })
    }, [])

    const { image } = data; 

    const handleAvatar = e => {
        setActive({ 
            ...isActive,
            avatar: isActive["avatar"] ? false : true,
            chat: false,
            notification: false,
        })
    }

    return (
        <div className="Avatar">
            <img src={getHost() + image} alt="" width="30px" height="30px"  onClick={handleAvatar}/>
            <i className="fa fa-caret-down"  onClick={handleAvatar}></i>
            { isActive["avatar"] ? <AvatarMenu /> : null }
        </div>
    )
}
