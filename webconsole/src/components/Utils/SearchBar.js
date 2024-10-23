import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
    const BarStyle = { width: "20rem", background: "white", border: "1px solid", margin: "0.5rem", padding: "0.5rem" };

    return (
        <div className="search-container">
            <span className='search-bar'>
                <FaSearch />
                <input
                    style={BarStyle}
                    key="search-bar"
                    placeholder={"search with keywords"}
                />
            </span>
        </div>
    );
};

export default SearchBar;
