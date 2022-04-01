import './ImageUploader.css';
import React from "react";

const ImageUploader = (props) => {

    let { id, alt, src, disabled, onChange, label, text } = props;

    id = id ? id : "image";
    src = src ? src : "";
    alt = alt ? alt : "";
    disabled = disabled ? disabled : false;

    return (
        <div className="image">
            <label>{ label ? label : "" }</label>
            <center>
                <img src={ src } alt={ alt } width="80px" height="80px" />
                {
                    !disabled &&
                    <button type="button">
                        <input type="file" id={ id } onChange={ onChange } />
                        <span>{ text ? text : "Upload" }</span>
                    </button> 
                }
            </center>
        </div>
    )
}

export default ImageUploader;