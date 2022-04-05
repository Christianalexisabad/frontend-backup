import Main from '../../components/layout/main/Main';
import SideBar from "../../components/layout/sideBar/SideBar";
import NavBar from "../../components/layout/navBar/NavBar";
import React from "react";
import "./Home.css";

export default function Home() {

    return (
        <div className="Home p-0">
            <div className="sideBarContainer bg-white sticky-top">
                <SideBar />
            </div>
            <div className="mainContainer p-0">
                <div className="row sticky-top">
                    <div className="col-lg-12 navbarContainer">
                        <NavBar />   
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Main />
                    </div>
                </div>
            </div>  
        </div>
    )
}