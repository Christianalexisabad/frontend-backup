import List from './components/List';
import React from 'react';
import './Announcement.css';

const Announcement = () => {

    return (
        <div className="Announcement">
            <div className="row row-1">
                <div className="col-lg-12">
                    <h1 className="title">Announcements</h1>
                </div>
            </div>
            <div className="row row-2">
                <div className="col-lg-12">
                    <List/>
                </div>
            </div>
            <div className="row row-3">
                <div className="col-lg-12">
                    
                </div>
            </div>
        </div>
    )
}

export default Announcement;
