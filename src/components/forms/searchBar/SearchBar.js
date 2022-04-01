import React from "react";
import './SearchBar.css';

const SearchBar = (props) => {

    const {
        value,
        onClear,
        onChange,
    } = props;

    return (
        <div className="SearchBar">
            <input 
                className="text-dark"
                type="text" 
                value={value} 
                onChange={onChange} 
                placeholder="Search"
            />
            {!value? null : <i className="fa fa-times" onClick={onClear}></i>}
        </div>
    )
}

export default SearchBar;