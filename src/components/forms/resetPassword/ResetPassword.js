import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import React, { useState } from "react";
import "./ResetPassword.css";

function ResetPassword(props) {

    let { id, username, disabled, display } = props;

    const [isActive, setActive] = useState(false);

    display = display ? display : true;

    if (isActive) {
        return <ConfirmDialog method="PATCH" from="users" username={username} onCancel={()=> setActive(false)} />
    }
    

    return (
        display &&
        <button 
            id={id}
            type="button"
            className="ResetPassword"
            onClick={()=> setActive(true)}
            disabled={disabled}
        >
            Reset Password
        </button> 
    )
}

export default ResetPassword;