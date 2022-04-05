import React from "react";

import "./CloseButton.css";
function CloseButton(props) {

    const { onClick } = props;

    return (
        <button className="CloseButton" type="button" onClick={onClick}>
            <i className="fa fa-close" />
        </button> 
    )
}

export default CloseButton;