import { isPath } from "../../../../../utility/Functions";
import React, { useState } from "react";
import Role from "../table/Role";
import Group from "../table/Group";
import UserGroup from "../table/UserGroup";
import UserPermission from "../table/UserPermission";
import GroupPermission from "../table/GroupPermission";
import { getUserID } from "../../../../../utility/Session";
import { createUserAcitivity } from "../../../../../utility/APIService";

export default function UserSettings() {

    const display = isPath("/pages/user%20settings/");
    const [isActive, setActive] = useState({});

    const data = [
        { 
            title: 'Role Table',
            content: <div>
                <Role />
            </div>
        },
        { 
            title: 'Group Table',
            content: <div>
                <Group />
            </div>
        },
        { 
            title: 'User Group Table',
            content: <div>
                <UserGroup />
            </div>
        },
        { 
            title: 'User Permission Table',
            content: <div>
                <UserPermission />
            </div>
        },
        { 
            id: 'list5', 
            title: 'Group Permission Table',
            content: <div>
                <GroupPermission />
            </div>
        },
    ]

 
     return (
        display &&
        <div className="Settings">
            <ul className="list m-0 p-0">
                {data.map((item, index) => {
                    const active = isActive[item.title];
                    return (
                        <li key={index} className="listItem" >
                            <p 
                                onClick={
                                    ()=> {

                                        !active && createUserAcitivity(
                                            getUserID(), 
                                            "Table", 
                                            "Visit",  
                                            "Visited " + item.title
                                        )
                                        
                                        setActive({ 
                                            ...isActive, [item.title]: active ? false : true 
                                        });
                                    }
                                }
                                style={{ 
                                        fontWeight: active ? 'bold' : 'normal', 
                                        borderBottom: active ? '1px solid rgb(230, 230, 230)' : 'none' 
                                    }}
                            >
                                <span>{item.title}</span>
                                <i className={"item-toggle " +(active ? "fa fa-angle-down" : "fa fa-angle-left")}></i>
                            </p> 
                            {active && item.content}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}