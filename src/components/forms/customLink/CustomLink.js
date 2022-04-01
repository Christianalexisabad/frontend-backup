import { Link } from "react-router-dom";
import { getSessionID } from "../../../utility/Session";
import { hasPermission } from "../../../utility/Permission";
import React from "react";
import "./CustomLink.css";

const CustomLink = (props) => {

    const { text, disabled, onClick, to, permission } = props;

    return (
        hasPermission(permission) &&
        <button className="CustomLink">
            <Link 
                to={to + getSessionID()}
                className="text-white text-decoration-none"
                disabled={disabled}
                onClick={onClick}
                title={text}
            >
                <span>{text}</span>
            </Link>
        </button> 

    )
}

export default CustomLink;