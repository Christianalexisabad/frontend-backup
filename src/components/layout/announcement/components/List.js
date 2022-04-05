import { getHost } from "../../../../utility/APIService";
import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';

function List(){

    const [data, setData] = useState([]);
    const path = '/api/announcements/';
    const host = getHost();

    useEffect(() => {
        
        const fetchData = async () => {
            const response = await axios.get(host + path)
            const { data } = await response.data;
            setData(data);
        }
        fetchData();
        
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

    return(
        <ul className="List">
            {data.length > 0 && data.map(item => {
                return(
                    <li className="list-item">
                        <label className="date">{item.created_at}</label>
                        <p className="title">{item.title}</p>
                        <p className="content">{item.description}</p>
                    </li>
                )
            })}
        </ul>
    )

}

export default List;