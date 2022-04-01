import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getHost } from "../../../../../../../../utility/APIService";
import { getCurrentDate, getReducedDate } from "../../../../../../../../utility/DateTime";
import "./DailyAttendance.css";

const DailyAttendance = () => {

    const [state, setState] = useState({
        startDate: getReducedDate(getCurrentDate(), 6),
        endDate: getCurrentDate(),
        options: {
            title: {
                text: "Daily Attendance",
                enabled: false,
                style: {
                    fontWeight: 'normal',
                    color: 'rgb(120,120,120)'
                }
            },
            xaxis: {
                categories: []
                }
            },
        series: [
            {
                data: []
            }
        ],
    });


    const { startDate, endDate } = state;

    const fetchData = useCallback(async() => {
        const response = await axios.get(getHost() + "/api/dashboard/daily-attendance/"+startDate+"/"+endDate+"/")
     
        const { data } = await response.data;
        
         setState({...state,
             series: [
                 {
                     data: Object.values(data)
                 }
             ],
             options: { 
                 xaxis: {
                     categories: Object.keys(data) 
                 }
             }
         });
     }, [ startDate, endDate, state ])

    useEffect(() => {
        if (startDate && endDate) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate, fetchData ]);

    const handleInputChange = (e) => {
        e.preventDefault();
        setState({...state, [e.target.id]: e.target.value});
    }
    
    return (
        <div className="DailyAttendance">
            <h1 className="title">Daily Attendance</h1>
            <span className="from">From: </span>
            <input type="date" value={startDate} id="startDate" onChange={handleInputChange} />
            <span className="from"> To: </span>
            <input type="date" value={endDate} id="endDate" onChange={handleInputChange} />
            <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="100%"
                height="250px"
            />
        </div>
    )
}

export default DailyAttendance;