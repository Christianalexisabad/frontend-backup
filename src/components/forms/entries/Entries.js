import React from "react";
import './Entries.css';

const Entries = (props) => {

    const { entries, onChange, onMouseDown, value } = props;

    let options = [];

    for (let i = 1; i <= entries; i++) {
        options.push(i)
    }

    return (
        <div className="Entries">
            <label>Show</label>
            <select onChange={onChange} onMouseDown={onMouseDown} disabled={entries > 0 ? false : true} value={value}>
                <option value={entries}>{entries > 0 ? "all" : "--"}</option>
                {options.map((value, index) =>{
                    return(
                        <option key={index} value={value}>{value}</option>
                    )
                })}
            </select>
            <label>entries</label>
        </div>
    )
}

export default Entries;