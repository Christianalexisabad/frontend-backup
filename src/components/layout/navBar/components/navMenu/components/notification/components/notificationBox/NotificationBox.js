import { deleteData } from "../../../../../../../../../utility/APIService";
import "./NotificationBox.css";
import React from 'react';

export default function NotificationBox ({ data }) {

    const renderNotificationList = () => {
        return (
            <ul className="notificationList p-0 m-1">
                {data.map(item => {
                    return (
                        <li className="notificationItem text-end">
                            <i 
                                className="fa fa-trash" 
                                onClick={()=> {
                                    deleteData("/api/notifications/delete/" + item.id + "/")
                                    .then(response => {
                                    })
                                }}
                            >
                            </i>
                            <p className="date m-0">{item.date}</p>
                            <p className="message m-0">{item.message} </p>
                        </li>
                    )
                })}
            </ul>    
        )
    }
    return (
        <div className="NotificationBox bg-white">
            <div className="container">
                <div className="row row-1">
                    <div className="col-lg-12">
                        <h1 className="title">Notifications</h1>
                    </div>
                </div>
                <div className="row row-2">
                    <div className="col-lg-12">
                        {
                            data.length > 0 ? renderNotificationList() : <p className="emptyErr">No Notification(s)</p>
                        }
                    </div>
                </div>
                {
                    data.length > 0 ? 
                    <div className="row row-3">
                        <div className="col-lg-12">
                            <div className="buttonContainer">
                                <button>Clear All</button>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        </div>
    )
}
