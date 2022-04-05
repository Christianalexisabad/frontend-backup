import React from "react";
import { useHistory } from "react-router-dom";
import { hasPermission } from "../../../utility/Permission";
import "./HelpButton.css";

function HelpButton(props) {

    let { id, permission, display } = props;
    const history = useHistory();

    display = permission === undefined ? true : permission ? hasPermission(permission) : display;
    
    return (
        display &&
        <button 
            id={id}
            title="Report Problem"
            type="button"
            className="HelpButton"
            onClick={() => history.push("/pages/report problem/")}
        >
            <i className="fa fa-question"></i>
        </button> 
    )
}

export default HelpButton;