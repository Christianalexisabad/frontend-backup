import React, { useEffect, useState } from 'react';
import './Input.css';

const initialStyles = {
    inputContainer: {
        borderBottom: '1px solid rgb(230, 230, 230)'
    },
    label: {
        fontWeight: 'normal',
    },
    input: {
        backgroundColor: 'auto',
    }
}

function Input (props) {

    const {
        id,
        name,
        placeholder,
        label,
        errMessage,
        disabled,
        value,
        type,
        refresh,
        dark,
        onChange,
        autoComplete
    } = props;

    const display = props.display === undefined ? true : props.display;
    const [styles, setStyles] = useState(initialStyles);

    useEffect(() => {

        if (disabled && dark) {
            setStyles({
                inputContainer: {
                    borderBottom: 'none'
                },
                input: { 
                    backgroundColor: 'rgb(240,240,240)'
                }
            })
            return false;
        }

        if (disabled) {
            setStyles(initialStyles);
            return false;
        }

        if (value) {
            setStyles({
                inputContainer: {
                    borderBottom: '1px solid rgba(20, 200, 20, 0.4)'
                }
            });
        } 

    }, [ id, disabled, value, dark ]);

    return (
        display &&
        <div className="input" style={styles.inputContainer}>
            <label style={styles.label}>
                { label }
                { errMessage ? 
                    <span className="text-danger">{ " *" + errMessage }</span> 
                    : 
                    value && <i className="fa fa-check-circle text-success"></i> 
                }
                { 
                    refresh && 
                    <i className="fa fa-refresh" title="Click to refresh" onClick={refresh} />
                }
            </label>
            <input 
                id={id}
                style={styles.input}
                name={name}
                type={type}
                disabled={disabled ? disabled : false}
                autoComplete={autoComplete !== undefined ? autoComplete : "off"}
                placeholder={placeholder}
                value={value ? value : ""} 
                onChange={onChange}
            />
        </div> 
    )
}

export default Input;