import { getUsername, has, isPath } from '../../../utility/Functions';
import { getHost } from '../../../utility/APIService';
import React, { useState, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';

function Settings(){

    const [permissions, setPermissions] = useState([]);

    useEffect(() =>{
        const fetchData = async() => {

            for (const item of [
                '/api/user-permissions/get/'+getUsername()+'/',
                '/api/group-permissions/get/'+getUsername()+'/',
            ]) {
                let response = await axios.get(getHost() + item)

                let data = [];
                for (const item of await response.data) {
                    try {
                        if (!has(JSON.stringify(data), item.permission.code_name)) {
                            data.push({
                                permission: item.permission.code_name
                            })
                        }
                    } catch (error) { }
                }
                setPermissions(data);
            }
        }
        fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[]);

    
    function hasPermission(permission) {
        for (const item of permissions) {
            if (item.permission === permission) {
                return 'inline-block';
            }
        }
        return "none"
    }

    const style = {
        display: isPath("/pages/user%20management/settings/") ? "block" : 'none'
    }

    return(
        <div className="Settings" style={style}>
            <div className="row">
                <div className="col-lg-12">
                    <ul className="menu">
                    </ul>
                </div>
            </div>
        </div>
    )
}


export default Settings