import { hasPermission } from "../../../utility/Permission";
import React from "react";
import "./SubmitButton.css";

const SubmitButton = (props) => {

    let { 
        disabled, 
        display, 
        permission, 
        text, 
        title, 
        type, 
        float, 
        onClick, 
        icon, 
    } = props;

    display = display === undefined ? true : permission ? hasPermission(permission) : display;

    return (
        display &&
        <button 
            className="SubmitButton"
            type={type ? type : "submit"}
            title={title}
            onClick={onClick && onClick}
            disabled={disabled}
            style={{
                float: float ? float : "none"
            }}
        >
            {
                icon && <i className={icon}></i>
            }
            { text ? 
                <span>{text}</span> : <span>Submit</span> 
            }
        </button> 
    )
}

export default SubmitButton;