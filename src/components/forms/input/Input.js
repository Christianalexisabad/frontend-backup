import React, { useEffect, useState } from 'react';
import { errMessage } from '../../../utility/Regex';
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
        isValid,
        required,
        disabled,
        value,
        type,
        validate,
        refresh,
        dark,
        onChange,
        autoComplete
    } = props;

    const display = props.display === undefined ? true : props.display;

    const [message, setMessage] = useState("");
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

        if (value) {
            
            if (validate && !isValid) {
                setMessage(errMessage[id]);
                return false;
            }

            setMessage(<i className="fa fa-check-circle text-success"></i>);

        }

    }, [ id, disabled, value, isValid, required, validate, dark ]);


    return (
        display &&
        <div className="input" style={styles.inputContainer}>
            <label style={styles.label}>
                { label }
                { value ? 
                    <span> { !disabled && message } </span> 
                    : 
                    required && <span className="text-danger"> *Required </span> 
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