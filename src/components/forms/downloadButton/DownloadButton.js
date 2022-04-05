import React from "react";
import { saveAs } from "file-saver";
import { getHost } from "../../../utility/APIService";
import "./DownloadButton.css";

function DownloadButton(props) {

    let { id, disabled, toDownload, display } = props;

    display = display ? display : true;

    return (
        display &&
        <button 
            id={id}
            type="button"
            className="DownloadButton"
            onClick={()=> {
                saveAs(getHost() + toDownload);
            }}
            disabled={disabled}
        >
            <i className="fa fa-download"> </i>
        </button> 
    )
}

export default DownloadButton;