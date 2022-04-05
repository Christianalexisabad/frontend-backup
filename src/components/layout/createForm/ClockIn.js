import { getCurrentDate, getCurrentTime, isTimeEqualTo, isTimeRange } from "../../../utility/DateTime";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import BackButton from "../../forms/backButton/BackButton";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import { isPath } from "../../../utility/Functions";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { useHistory } from "react-router-dom";
import { getEmployeeID } from "../../../utility/Session";

const ClockIn = () => {

    const display = isPath("/pages/self%20service/attendance/clock%20in/");
    const  history = useHistory();

    const [data, setData] = useState({});
    let [date, setDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const currentDate = date.toLocaleDateString().replace(/\//g,"-");
    const currentTime = "08:12:00 AM";

    const employee = getEmployeeID();

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/attendances/get/employee="+ employee +"/"+getCurrentDate()+"/");
        const { data } = await response.data;
        setData(data); 
    }

    const { id, am_in, am_out, pm_in, pm_out , am_status, pm_status } = data;  

    useEffect(() =>{
        if (display) {
            fetchData();
        }
    }, [display])

    function refreshClock() {
        setDate(new Date());
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
          clearInterval(timerId);
        };
    }, []);

    function postData(data) {
        axios.post(getHost() + "/api/attendances/new/", data)
        .then(res => {
            setMessage("Time in success!");
            setSuccess(true);

            setTimeout(() => {
                window.location.reload();
            }, 1000)
        })
    }   

    function patchData(data) {
        axios.patch(getHost() + "/api/attendances/update/" + id + "/", data)
        .then(res => {
            setMessage("Time in success!")
            setSuccess(true);

            setTimeout(() => {
                window.location.reload();
            }, 1000)
        })
    }   

    const handleSubmit  = (e) => {
        e.preventDefault();

        const time = "08:12:00 AM";
        const A = getCurrentTime().split(" ")[1];

        alert(id)

        // if (!id) {
        //     if (A ==="AM") {
        //         if(isTimeRange(time, "07:31:00 AM" , "08:00:00 AM")){
        //             // postData({
        //             //     employee: employee,
        //             //     date: getCurrentDate(),
        //             //     am_in: getCurrentTime(),
        //             //     am_status: 1
        //             // });
        //         }
        //         else if (isTimeRange(time, "08:01:00 AM" , "08:15:00 AM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_in: getCurrentTime(),
        //                 am_status: 2
        //             });
        //         }
        //         else if (isTimeRange(time, "08:16:00 AM" , "11:44:00 AM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_in: getCurrentTime(),
        //                 am_status: 4
        //             });
        //         } else if (isTimeRange(time, "11:45:00 AM" , "11:59:00 AM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_in: getCurrentTime(),
        //                 am_status: 4
        //             });
        //         }else if (time === "12:00:00 PM"){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_in: getCurrentTime(),
        //                 am_status: 1
        //             });
        //         }
        //     // PM
        //     }else {

        //         if (isTimeRange(time,"12:01:00 PM" , "12:29:00 PM")){
        //             setMessage("Please time in again at 12:30:00 PM.");
        //             setSuccess(false);
        //         } else if (isTimeRange(time, "12:31:00 PM" , "12:59:00 PM") || isTimeEqualTo(time, "01:00:00 PM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_status: 4,
        //                 pm_in: getCurrentTime(),
        //                 pm_status: 1
        //             });
        //         } else if (isTimeRange(time, "01:01:00 PM" , "01:15:00 PM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_status: 4,
        //                 pm_in: getCurrentTime(),
        //                 pm_status: 2
        //             });
        //         } else if (isTimeRange(time, "01:16:00 PM" ,"04:44:00 PM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_status: 4,
        //                 pm_in: getCurrentTime(),
        //                 pm_status: 4
        //             });
        //         } else if (isTimeRange(time, "04:45:00 PM", "04:59:00 PM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_status: 4,
        //                 pm_in: getCurrentTime(),
        //                 pm_status: 4
        //         });
        //         } else if (isTimeRange(time, "05:00:00 PM", "05:30:00 PM")){
        //             postData({
        //                 employee: employee,
        //                 date: getCurrentDate(),
        //                 am_status: 4,
        //                 pm_in: getCurrentTime(),
        //                 pm_status: 4
        //             });
        //         }
        //     }
        // } else { 
        //     if (A === 'AM') {

        //         if (am_in && am_out) {
        //             setMessage("Morning attendance is complete.");
        //             setSuccess(false);
        //             return false;   
        //         }

        //         if(isTimeRange(time, "05:31:00 PM" , "07:29:00 AM")){
        //             setMessage("You cannot time in at this moment.");
        //             return false;
        //         } 

        //         if (isTimeRange(time, "08:01:00 AM" , "08:15:00 AM")){
        //             patchData({
        //                 am_out: getCurrentTime(),
        //                 am_status: 4
        //             });
        //         }
        //         else if (isTimeRange(time, "08:16:00 AM" , "11:44:00 AM")){
        //             patchData({
        //                 am_out: getCurrentTime(),
        //                 am_status: 4
        //             });
        //         } else if (isTimeRange(time, "11:45:00 AM" , "11:59:00 AM")){
        //             patchData({
        //                 am_out: getCurrentTime(),
        //                 am_status: 5
        //             });
        //         }
        //         else if (isTimeEqualTo(time, "12:00:00 PM")){
        //             patchData({
        //                 am_out: getCurrentTime(),
        //                 am_status: 1
        //             });
        //         }
        //     } else {
                
        //         if (pm_in && pm_out) {
        //             setMessage("Today's attendance is already complete.");
        //             return false;   
        //         }

        //         if (isTimeRange(time,"12:01:00 PM" , "12:29:00 PM")){
        //             setMessage("Please time in again at 12:30:00 PM.");
        //             setSuccess(false);
        //         } else if (isTimeRange(time, "12:31:00 PM" , "12:59:00 PM") || isTimeEqualTo(time, "01:00:00 PM")){
        //             patchData({
        //                 pm_out: getCurrentTime(),
        //                 pm_status: 4
        //             });
        //         } else if (isTimeRange(time, "01:01:00 PM" , "01:15:00 PM")){
        //             patchData({
        //                 pm_out: getCurrentTime(),
        //                 pm_status: 4
        //             });
        //         } else if (isTimeRange(time, "01:16:00 PM" ,"04:44:00 PM")){
        //             patchData({
        //                 pm_out: getCurrentTime(),
        //                 pm_status: 4
        //             });
        //         } else if (isTimeRange(time, "04:45:00 PM", "04:59:00 PM")){
        //             patchData({
        //                 pm_out: getCurrentTime(),
        //                 pm_status: 5
        //             });
        //         } else if (isTimeRange(time, "05:00:00 PM", "05:30:00 PM")){
        //             patchData({
        //                 pm_out: getCurrentTime(),
        //                 pm_status: 1
        //             });
        //         }
        //     }
        // }
    }

    return (
        display &&
    <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Clock In"
                                    onClick={() => {
                                        setMessage("");
                                        history.goBack();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div> 
    )
}

export default ClockIn;