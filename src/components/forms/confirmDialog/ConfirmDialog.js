import CancelButton from "../cancelButton/CancelButton";
import SubmitButton from "../submitButton/SubmitButton";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import "./ConfirmDialog.css";
import axios from "axios";

export default function ConfirmDialog (props){

    let { data } = props;

    const [isSuccess, setSuccess] = useState(false);

    const [message, setMessage] = useState("");

    useEffect(() => {
        if (data) {
            setSuccess(false);
            setMessage(data.message)
        }
    }, [data])
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.method) {
            props.onCancel();
            return false;
        }

        if (isSuccess) {
            setSuccess(false);
            props.onCancel();
        }

        if (data.method === "update") {
            axios.patch(data.url, data.data).then((response) => {
                if (data.data.id) {
                    axios.patch(getHost() + "/api/office-supply-requests/approve/" + data.data.id + "/")
                    .then((response) => {
                        setMessage(response.data.message);
                        setSuccess(true);
                    })   
                } else {
                    setMessage(response.data.message);
                    setSuccess(true);
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
               
            }).catch((error) => {
                setMessage(error.response.data.message);
                setSuccess(false);
            })
        } else if (data.method === "logout") {
            axios.delete(data.url).then((response) => {
            }).catch(err => {
                axios.patch(data.data.url, data.data.data).then((response) => {
                    setMessage(response.data.message);
                    setSuccess(true);
                })
            })
        } else {
            axios.delete(data.url).then((response) => {
                setMessage(response.data.message);
                setSuccess(true);
            })
        }
    
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setSuccess(false);
        props.onCancel();
    }

    return (
        data &&
        <div className="ConfirmDialog">
            <div className="container" style={{ width: "20%", marginLeft: "40%"}}>
                <form onSubmit={handleSubmit} style={{ width: "100%"}}>
                    <p>{message}</p>
                    {data.method && <CancelButton display={!isSuccess}  onClick={handleCancel} /> }
                    <SubmitButton text={!data.method || isSuccess ? "OK" : "Confirm"} />
                </form>
            </div>
        </div>
    )
}