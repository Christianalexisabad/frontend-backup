import { getHost } from "../../../utility/APIService";
import "./ArchiveButton.css";
import React from "react";
import axios from "axios";

function ArchiveButton(props) {

    const { id, disabled, table, is_archived } = props;

    return (
        <button
            id={id}
            type="button"
            className="ArchiveButton"
            onClick={ 
                () => {
                    axios.patch(getHost() + "/api/"+ table + "/update/" + id + "/", {
                        is_archived: is_archived ? 0 : 1
                    })
                }
            }
            disabled={disabled}
        >
            {!is_archived ? <i className={"fas fa-archive text-primary"}> </i> : "Show"}
        </button> 
    )
}

export default ArchiveButton;