import { has, setModule, setTableName, toCapitalized } from "../../../../utility/Functions";
import { getSessionID, getUserID } from "../../../../utility/Session";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./SideMenu.css"
import { Menu } from "../../../../utility/Constants";
import { createUserAcitivity } from "../../../../utility/APIService";
import { fetchPermissions } from "../../../../utility/Permission";
import { createHistory, currentURL, getHistory } from "../../../../utility/History";

const SideMenu = () => {

    const history = useHistory();
    const [isActive, setActive] = useState({})
    const [permissions, setPermissions] = useState([]);
    
    useEffect(() => {
     
        if (permissions.length === 0) {
            fetchPermissions()
            .then(permissions => {
                setPermissions(permissions)
            })
        }
    
    }, [permissions]);

    function hasPermission(permission) {
     
        for (const item of permissions) {
            if (item === permission) {
                return true;
            }   
        }
    
        return false;
    
    }


    function renderDropdownMenu(module ,menu) {

        function handleItemClick(module, title){
          
            setModule(module);
            setTableName(title);
            createUserAcitivity(
                getUserID(), 
                "Table", 
                "Visited", 
                "Visited " + title + " Table"
            )
            
            currentURL() !== getHistory() && createHistory();
       
        }

        return (
            <ul className="dropdownMenu">
                {menu.map(item => {

                    const { id, title, pathname } = item;

                    return (
                        hasPermission(id) &&
                        <Link 
                            key={id}
                            className="dropdownItem"
                            to={pathname + getSessionID()}
                            onClick={
                                () => {
                                    handleItemClick(module, title)
                                }
                            }
                        >
                            <span>{title}</span>
                        </Link>
                    )
                })}
            </ul>
        )
    }

    function handleModuleClick(title, pathname) {

        const moduleName = toCapitalized(pathname.split("/")[2]);
        const isTable = has(moduleName, 'Dashboard') || has(moduleName, 'Settings') ? false : true

        setModule(title);
        setTableName("");
        createHistory();

        createUserAcitivity(
            getUserID(), 
            title === "Users" ? "Table" : "Module", 
            "Visited",  
            "Visited " + (isTable ? moduleName + " Table" : moduleName)
        )

        history.push(pathname + getSessionID());
    }

    const styles = {
        container: {
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: window.innerHeight - (window.innerHeight * .20)
        }
    }

    return (
        <div className="SideMenu" style={styles.container}>
            <ul>
            {Menu.map((module, index) => {

                const {id, title, icon, toggleIcon, item, pathname } = module;

                return (
                    hasPermission(id) &&
                    <li key={index} className="sideItem">
                        <p 
                            className="title" 
                            onClick={
                                () => {
                                    !item ?
                                    handleModuleClick(title, pathname)
                                    :
                                    setActive({ ...isActive, [title]: isActive[title] ? false : true}) 
                                }
                            }
                        >
                            <i className={icon + " icon"}></i>
                            <span>{title}</span>
                            {item && <i className={(isActive[title] ? 'fa fa-angle-down' : toggleIcon) + " toggleIcon"}></i>}
                        </p>
                        {isActive[title] ? renderDropdownMenu(title, item) : null}
                    </li>
                )
            })} 
        </ul>
        </div>
    )
}

export default SideMenu;