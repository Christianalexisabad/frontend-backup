import React from "react";
import "./ApproveButton.css";

function ApproveButton(props) {

    return (
        <button 
            id="approve"
            type="button"
            title="Approve"
            className="ApproveButton"
            onClick={props.onClick}
        >
            <i className="fa fa-check"> </i>
        </button> 
    )
}

export default ApproveButton;