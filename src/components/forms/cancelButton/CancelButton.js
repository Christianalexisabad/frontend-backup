import React from "react";
import "./CancelButton.css";

function CancelButton(props) {

    let { text, onClick, display } = props;

    display = display === undefined ? true : display;

    return (
        display &&
        <button className="CancelButton" type="button" onClick={onClick}>
            {text ? text : 'Cancel'}
        </button> 
    )
}

export default CancelButton;