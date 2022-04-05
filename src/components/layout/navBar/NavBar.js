import NavMenu from './components/navMenu/NavMenu';
import { Link } from 'react-router-dom';
import React from 'react';
import './NavBar.css';

const NavBar = (props) => {
    return (
        <nav className="NavBar">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2 col-md-3 col-sm-4 navBarBrand m-0">
                        <Link style={{ color: 'rgb(40, 135, 45)' }} to="/">
                            e-Candoni
                        </Link>
                    </div>
                    <div className="col-lg-10 col-md-9 col-sm-8 navMenuContainer">
                        <NavMenu />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;