import SideBar from "../components/layout/sideBar/SideBar";
import NavBar from "../components/layout/navBar/NavBar";
import React from "react";
import "./index.css";

export default function Index () {
    return (
        <div className="Index p-0">
            <div className="sideBarContainer bg-white sticky-top">
                <SideBar />
            </div>
            <div className="mainContainer p-0">
                <div className="row sticky-top">
                    <div className="col-lg-12 navbarContainer">
                        <NavBar />   
                    </div>
                </div>
            </div>  
        </div>
    )
}
