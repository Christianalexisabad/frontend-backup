import React from "react";
import { useHistory } from "react-router-dom";
import { getSessionID } from "../../../utility/Session";
import { hasPermission } from "../../../utility/Permission";
import "./EditButton.css";

const EditButton = (props) => {

    const history = useHistory();

    let {
        to,
        text,
        icon,
        display,
        onClick,
        disabled,
        permission,
    } = props;

    display = permission === undefined ? true : hasPermission(permission);

    const handleClick = (e) => {
        e.preventDefault();

        to ? history.push(to + getSessionID()) : onClick();
    }

    return (
        display &&
        <button className="EditButton" type="button" onClick={handleClick} disabled={disabled ? disabled : false}>
            <i className={icon ? icon : "fa fa-edit"}></i>
            { text && <span> {text} </span> }
        </button> 
    )
}

export default EditButton;