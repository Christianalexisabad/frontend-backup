import React, { useEffect, useState } from "react";
import { hasPermission } from "../../../utility/Permission";
import "./Button.css";

function Button(props) {

    const { id, text, disabled, onClick, icon, permission } = props;
    const [display, setDisplay] = useState(true);

    useEffect(() => {

        if (props.display !== undefined) {

            if (!props.display) {
                setDisplay(false);
                return;
            }

            if (props.display) {
                setDisplay(true);
                return;
            }

            if (permission && permission !== undefined) {
                setDisplay(hasPermission(permission));
            }    
        }

    }, [ props.display, permission ])

    let title = icon === 'fa fa-refresh' ? 'Refresh' :
                icon === 'fas fa-th-large' ? 'Table View' : 
                icon === 'fa fa-table' ? 'Card View' : text;

    return (
        display &&
        <button 
            id={id}
            title={title}
            type="button"
            className="Button"
            onClick={onClick}
            disabled={disabled ? disabled : false}
        >
            { icon && <i className={icon} /> }
            <span>{ text }</span>
        </button>
    )
}

export default Button;