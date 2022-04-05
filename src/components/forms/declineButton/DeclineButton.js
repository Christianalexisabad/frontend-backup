import React from "react";
import "./DeclineButton.css";

function DeclineButton(props) {

    return (
        <button 
            id="decline"
            type="button"
            title="Decline"
            className="DeclineButton"
            onClick={props.onClick}
        >
            <i className="fa fa-times"> </i>
        </button> 
    )
}

export default DeclineButton;