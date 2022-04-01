import React from "react"
import "./ChatBox.css";

export default function ChatBox (props) {

    const { data } = props; 

    return (
        <div className="ChatBox bg-white container p-3" style={{ width: '200px'}}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="header">
                        <h1>Messages</h1>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="content">
                        <ul className="conversations">
                            {data.map((item, index) => {
                                return (
                                    <li key={index} className="m-1" style={{ 
                                        backgroundColor: !item.replies[0].is_seen ? 'rgb(200, 200, 200)' : 'white'
                                    }}>
                                        <i className="fa fa-reply"></i>
                                        <p>{item.replies[0].message}</p>
                                    </li>
                                )
                            })}
                        </ul>      
                    </div>
                </div>
            </div>
        </div>
    )
}
