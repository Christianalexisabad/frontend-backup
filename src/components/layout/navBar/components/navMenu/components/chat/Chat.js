import ChatBox from './components/chatBox/ChatBox';
import { getHost } from "../../../../../../../utility/APIService";
import { getUserID } from "../../../../../../../utility/Session";
import React, { useEffect, useState } from 'react'
import axios from 'axios'; 

export default function Chat ({ isActive, setActive }) {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/conversations/" + getUserID() + "/");
        const { data } = await response.data;
        setData(data);
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="Chat">
            <i 
                className={(data.length > 0 ? "fa fa-envelope" : "fa fa-envelope-o") + " icon"}
                onClick={() => setActive({ 
                    ...isActive,
                    chat: isActive["chat"] ? false : true,
                    notification: false,
                    avatar: false,
                })}>
            </i>
            {data.length > 0 && <span style={{
                fontSize:"12px",
                float: "right",
            }}>{data.length}</span>}
            {
                isActive["chat"] ? <ChatBox data={data} /> : null
            }
        </div>
    )
}
