
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Attachement.css';

const Attachement = (props) => {

    let { id, value, disabled, onChange, label, url } = props;
    const history = useHistory();

    disabled = disabled ? disabled : false;
    
    return (
        <div className="Attachement">
            <label>{ label ? label : "Attachement" }</label>
            <button type="button">
                <input type="file" id={id ? id : "attachement"} onChange={onChange} />
                <span> <i className="fas fa-file-upload"></i> </span>
            </button> 
            <button type="button" onClick={ e =>{
                e.preventDefault();
                url ? window.open(url , "__blank"): e.stopPropagation();
            }}>
                <i className="fas fa-search"/>
            </button>
            <input type="text" value={value} disabled={disabled} placeholder='File name' />
        </div>
    )
}

export default Attachement;