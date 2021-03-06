import React from 'react'
import { Link } from 'react-router-dom';
import { getSessionID } from '../../../utility/Session';
import './Select.css';

const Select = (props) => {
   
    const {
        id,
        label,
        refresh,
        disabled,
        value,
        errMessage,
        create,
        createText,
        onChange,
        onClick
    } = props;

    const styles = {
        container:{
            borderBottom: disabled || !value ? '1px solid rgb(230, 230, 230)' : '1px solid rgb(100, 250, 100)'
        },
        button: { 
            color: 'blue' 
        },
        errMessage: {
            fontSize: '12px'
        }
    };

    let data = [];

    try {
        data = props.options.length > 0  ? props.options : [];
    } catch (error) {
        
    }

    function renderOptions(){
        try {
            return data.length > 0 && data.map((item, index) =>{
                const value = Object.values(item);
                return <option key={ index } value={ value[0]}>{value[1] }</option>
            })      
        } catch (error) {
            console.log(error)    
        }
    }

    return (
        <div className="select" style={styles.container}>
            <label>
                <span> { label } </span>
                { errMessage ? 
                    <span className="text-danger" style={styles.errMessage}>{ " *" + errMessage }</span> 
                    : 
                    value && <i className="fa fa-check-circle text-success"></i> 
                }
                { onClick ? 
                    <button 
                        type="button" 
                        style={styles.button} 
                        onClick={ onClick }
                    >
                        { createText }
                    </button> : 
                    <Link 
                        className="link" 
                        to={ create + getSessionID() }
                    >
                        <span>{ createText }</span>
                    </Link> }
                { refresh && 
                    <i 
                        className="fa fa-refresh" 
                        title="Click to refresh" 
                        onClick={ refresh } 
                    /> 
                }
            </label>
            <select 
                id ={id} 
                value={ !value ? "" : value }
                disabled={ disabled }
                onChange={ onChange }
            >
                <option value="">{ disabled && !value ? "---" : "Select" }</option>
                { renderOptions() }
            </select>
        </div>
    )
}

export default Select;