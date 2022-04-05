import React, { useEffect, useState } from "react"
import SideMenu from "../../../../../sideBar/sideMenu/SideMenu";
import { getHistory } from "../../../../../../../utility/History";
import "./MenuBar.css";

export default function MenuBar() {

    const [isActive, setActive] = useState({
        avatar: false,
        chat: false,
        notifications: false,
    });

    // const renderSubModule = (item) => {
    //     const subItem = item.item;
    //     try {
    //         return (    
    //             <ul className="subModule">
    //                 {subItem.map((data, index) =>{
    //                     return (
    //                         <li key={index} className="subModuleItem">
    //                             <p 
    //                                 className="subTitle"
    //                                 onClick={() => {
    //                                     setModule(item.title);
    //                                     setTableName(data.title);
    //                                     pushTo(data.pathname + getSessionID());
    //                                 }} 
    //                             >
    //                                 {data.title}
    //                             </p>
    //                         </li>
    //                     )
    //                 })}
    //             </ul>
    //         )
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // function renderModules() {
    //     return (
    //         <ul className="module">
    //             {Menu.map((item, index) => {
    //                 return (
    //                     <li key={index} className="moduleItem">
    //                         <p className="title" onClick={() =>  {
    //                                 if (item.item === undefined) {
    //                                     setModule(item.title);
    //                                     setTableName("");
    //                                     pushTo(item.pathname);
    //                                 } else {
    //                                     setActive({ ...isActive, [item.title]: isActive[item.title] ? false : true })
    //                                 }
    //                             }}>
    //                             {item.title}
    //                         </p>
    //                         {isActive[item.title] ? renderSubModule(item) : null}
    //                     </li>
    //                 )
    //             })}
    //         </ul>   
    //     )
    // }

    const { availWidth } = window.screen;
    const { href } = window.location;
    const HISTORY = getHistory();

    useEffect(()=> {
        if (availWidth < 768 && HISTORY !== href) {
            setActive({...isActive, menu: false})
        }
    /* eslint-disable react-hooks/exhaustive-deps */
    },[availWidth, HISTORY])

    return (
        <div className="MenuBar">
            <i className="fa fa-bars" 
                onClick={ ()=> setActive({ ...isActive, menu: isActive["menu"] ? false : true})}
            >
            </i>
            {isActive["menu"] && <SideMenu />}           
        </div>
    )
}