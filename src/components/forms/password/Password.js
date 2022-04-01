import React, { useEffect, useState } from 'react';
import './Password.css';

const Password = (props) => {

    const [type, setType] = useState(true);
    const [icon, setIcon] = useState("fa fa-eye");
    const [style, setStyle] = useState({});

    let {
        id,
        name,
        value,
        placeholder,
        label,
        disabled,
        onChange,
    } = props;

    useEffect(()=>{

        setTimeout(() => {
            if (!type) {
                setType(true);
            }
        }, 1000);

    }, [ type ])

    useEffect(() => {
        setStyle(
            disabled || !value ? {
                borderBottom: '1px solid rgb(230, 230, 230)',
            } : {
                borderBottom: '1px solid rgb(100, 250, 100)',
            }
        )
    }, [ disabled, value ])

    useEffect(() => {
        setIcon(type ? "fa fa-eye" : "fa fa-eye-slash");
    }, [ type ])

    return (  
        <div className="password" style={style}>
            <label>
                <span>{label ? label : "password"} </span>
                <span> {value ? <i className="fa fa-check-circle text-success"></i> : ""} </span>
            </label>
            <input 
                id={id ? id : "password"}
                name={name ? name : "password"}
                type={type ? "password" : "text"}
                disabled={disabled ? disabled : false}
                placeholder={placeholder ? placeholder : ""}
                value={value ? value : ""} 
                onChange={onChange}
            />
            { value && 
                <i 
                    className={icon} 
                    onClick={() => setType(false)} 
                />
            }
        </div> 
    )
}

export default Password;