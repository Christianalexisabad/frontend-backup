import { useHistory } from 'react-router-dom';
import { getSessionID } from '../../../utility/Session';
import './Title.css';
import React from "react";
import CancelButton from '../cancelButton/CancelButton';

function Title(props){

    const { text, to, onClick } = props;
    const history = useHistory();

    return (
        <h1 className="Title">
            <span>{text}</span>
            {to && <i className="fa fa-table" onClick={() => history.push(to + getSessionID()) }></i>}
            {onClick && <CancelButton text="Back" onClick={onClick}/> } 
        </h1>
    )
}

export default Title;