import React from "react";
import "./AlertMessage.css";

export default function AlertMessage (props){

    const { message } = props;

    return (
        message &&
        <div className="AlertMessage">
            <div className="container">
                <p dangerouslySetInnerHTML={{ __html: message }} />
                <button type="button" onClick={()=> props.onClose()}>Ok</button>
            </div>
        </div>
    )
}