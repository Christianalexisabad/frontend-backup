import ConfirmDialog from "./../confirmDialog/ConfirmDialog";
import { getHost } from "../../../utility/APIService";
import React, { useState } from "react";
import "./DeleteButton.css";
import { hasPermission } from "../../../utility/Permission";

function DeleteButton(props) {

    let { id, from, name, disabled, permission, onClick, onCancel } = props;

    const [toDelete, setToDelete] = useState(null); 

    const display = permission ? hasPermission(permission) : true;

    if (toDelete) {
        return (
            <ConfirmDialog 
                data={toDelete}
                onCancel={()=> {
                    setToDelete(null);
                    onCancel();
                }}
            />
        )
    }

    return (
        display &&
        <button 
            id={id}
            type="button"
            className="DeleteButton"
            onClick={
                onClick ? 
                onClick : 
                ()=> {
                    setToDelete({
                        method: 'delete',
                        message: "Are you sure you want to delete " + name + "?",
                        url: getHost() + "/api/" + from + "/delete/" + id + "/"
                    });
                }
            }
            disabled={disabled}
        >
            <i className="fa fa-trash"> </i>
        </button> 
    )
}

export default DeleteButton;