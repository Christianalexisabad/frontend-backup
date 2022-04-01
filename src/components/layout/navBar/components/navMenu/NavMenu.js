import Notification from "./components/notification/Notification";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import MenuBar from "./components/menuBar/MenuBar";
import Avatar from "./components/avatar/Avatar";
import React, { useState } from "react";
import "./NavMenu.css";

export default function NavMenu(props) {

    const [searchTerm, setSearchTerm] = useState();
    const [isActive, setActive] = useState({});

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        setSearchTerm(value);
    }

    return (
        <ul className="NavMenu">
            <li className="navItem" onMouseEnter={()=> setActive({})}>
                <SearchBar 
                    value={ searchTerm }
                    onChange={ handleSearchBarChange }
                    onClear={ ()=> setSearchTerm('') }
                />
            </li>   
            <li className="navItem">
                <Notification setActive={setActive} isActive={isActive} />
            </li>   
            <li className="navItem">
                <Avatar setActive={setActive} isActive={isActive} />
            </li>
            <li className="navItem">
                <MenuBar isActive={isActive} setActive={setActive}/>
            </li>
        </ul>
    )
}