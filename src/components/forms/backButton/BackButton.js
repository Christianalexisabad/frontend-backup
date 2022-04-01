import React from "react";
import { Link } from "react-router-dom";
import { getSessionID } from "../../../utility/Session";
import "./BackButton.css";

const BackButton = (props) => {

    const {
        to,
        disabled,
        onClick,
    } = props;

    return (
        <Link
            type="button"
            className="BackButton"
            disabled={disabled}
            onClick={onClick}
            to={to + getSessionID()}
        >
            <i className="fa fa-angle-left" />
        </Link>
    )
}

export default BackButton;