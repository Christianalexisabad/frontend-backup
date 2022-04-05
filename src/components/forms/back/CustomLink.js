import React from "react";
import { Link } from "react-router-dom";
import "./CustomLink.css";

const CustomLink = (props) => {

    const {
        text,
        icon,
        disabled,
        onClick,
        to,
    } = props;

    const display = props.display ? props.display : true;

    return (
        display ?
        <Link 
            type="button"
            to={to}
            className="CustomLink"
            disabled={disabled}
            onClick={onClick}
            title={text ? text : "Create"}
        >
            <i className={icon ? icon : "fa fa-plus"} />
            <span>{text ? text : "Create"}</span>
        </Link> : null
    )
}

export default CustomLink;