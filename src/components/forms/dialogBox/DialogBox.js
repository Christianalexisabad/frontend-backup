import React from 'react';
import "./DialogBox.css";

const DialogBox = (props) => {

    const { isSuccess, message, onClose } = props;

    return (
        message ? 
        <div className="DialogBox text-white">
            <p className={isSuccess ? "success" : "failed"} > 
                {message} 
                <i className="fa fa-times" onClick={onClose}></i>
            </p>
        </div> : null
    )
}

export default DialogBox;