import { getHost } from "../../../utility/APIService";
import "./PreviewButton.css";
import React from "react";

function PreviewButton(props) {

    let { id, to , disabled, display } = props;
    display = display ? display : true;

    return (
        display &&
        <button
            id={id}
            type="button"
            className="PreviewButton"
            onClick={ 
                () => {
                    window.open(getHost() + to, "__blank");
                }
            }
            disabled={disabled}
        >
            <i className="fa fa-search"> </i>
        </button> 
    )
}

export default PreviewButton;