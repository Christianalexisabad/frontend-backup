import { getHost } from "../../../../../../utility/APIService";
import { isPath } from '../../../../../../utility/Functions';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SuperAdminDashboard.css';
import UserList from "../../table/UserList";
import { SUPER_ADMIN_DASHBOARD } from "../../../../../../utility/Route";

const SuperAdminDashboard = () => {

    const display = isPath(SUPER_ADMIN_DASHBOARD);

    const [data, setData] = useState({
        users: 0,
        new_users: 0,
        online: 0,
        offline: 0,
    });

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/dashboard/super-admin/")
        const { data } = await response.data;
        setData(data);
    }

    useEffect(() =>{
        display && fetchData();
    }, [display]);

    const renderCard =() => {

        const { 
            users,
            new_users,
            online,
            offline,
         } = data;

        const hrData = [
            { title: "Users", icon: "fa fa-users", value: users, color: "rgb(20,20,120)" },
            { title: "New", icon: "fa fa-user", value: new_users, color: "rgb(20,200,20)" },
            { title: "Online", icon: "fa fa-wifi", value: online, color: "rgb(20,150,20)" },
            { title: "Offline", icon: "fa fa-times", value: offline, color: "rgb(120,50,50)"},
        ]

        return hrData.map((item, index) => {

            const { value, title, icon, color } = item;

            return (
                <div key={index}  className="card">
                    <ul>
                        <li>
                            <p className="value">{!value ? 0 : value}</p>
                            <p className="label">{title}</p>
                        </li>
                        <li>
                            <i className={icon} style={{ color: color}}></i>
                        </li>
                    </ul>
                </div>
            )
        })
    }

    return (
        display &&
        <div className="SuperAdminDashboard">
            <div className="row">
                <div className="col-lg-12 p-0">
                    {renderCard()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <UserList />
                </div>
            </div>
        </div> 
    )
}

export default SuperAdminDashboard;