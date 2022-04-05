import NotificationBox from './components/notificationBox/NotificationBox';
import { getHost } from '../../../../../../../utility/APIService';
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { getUserID } from '../../../../../../../utility/Session';

export default function Notification ({ isActive, setActive }) {
    
    const apiURL = getHost() + "/api/notifications/user=" + getUserID() +"/";

    const [data, setData] = useState([]);
    const total = data.length;

    const fetchData = useCallback(async () => {
        const response = await axios.get(apiURL);
        const { data } = await response.data;
        setData(data);
    }, [ apiURL ])

    useEffect(() => { 
        fetchData()
        // setTimeout(() => , 2000);
    }, [ fetchData ]) 
    
    const styles = {
        span: {
            fontSize:"12px",
            float: "right",
            fontWeight:"bold"
        }
    }

    return (
        <div className="Notification">
            <i 
                className={(total > 0 ? "fa fa-bell" : "fa fa-bell-o") + " icon"}
                onClick={() => setActive({ 
                    ...isActive,
                    notification: isActive["notification"] ? false : true,
                    chat: false,
                    avatar: false,
                })}
            />
            {total > 0 && <span style={styles.span}>{ total }</span> }
            {isActive["notification"] && <NotificationBox data={data} />}
        </div>
    )
}
