
import { getHost } from "../../../../../utility/APIService";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";
import CancelButton from "../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../forms/submitButton/SubmitButton";
import { addMinute, addSecond, substractSecond, subtractMinute, to24Hour } from "../../../../../utility/DateTime";

export default function AttendanceSettings() {

    const [data, setData] = useState({
        am_start_time: "00:00:00",
        am_end_time: "00:00:00",
        pm_start_time: "00:00:00",
        pm_end_time: "00:00:00",
        late_within: 1,
        absent: 0,
        undertime_after: 45,
        grace_before_start_time: "",
        grace_after_start_time: "",
        grace_before_end_time: "",
        grace_after_end_time: "",
    });

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/settings/")
        const { data } = await response.data;
        setData(data);
    }
    
    useEffect(() => {
        fetchData();
    }, [ ])

    let { 
        am_start_time,
        am_end_time,
        pm_start_time,
        pm_end_time,
        am_in, 
        am_late, 
        am_out,
        am_absent, 
        am_undertime, 
        pm_in, 
        pm_late,
        pm_undertime, 
        pm_out,
        grace_before_start_time, 
        grace_after_start_time, 
        grace_before_end_time, 
        grace_after_end_time, 
    } = data;

    function getHour(time) {
        return time ? parseInt(time.split(':')[0]) : 0;
    }

    const handleInputChange = (e) => {
        e.preventDefault();

        let { id, value } = e.target;

        if (!value) {
            return;
        }

        if (id === 'am_start_time' && getHour(value) > 12) {
            return false;
        }

        if (id === 'am_end_time' && (getHour(value) >= getHour(pm_start_time) || getHour(value) <= getHour(am_start_time))) {
            return false;
        }

        if (id === 'pm_start_time' && (getHour(value) <= getHour(am_end_time))) {
            return false;
        }

        if (id === 'pm_end_time' && (getHour(value) <= getHour(pm_start_time))) {
            return false;
        }

        if (id.search("grace") > -1) {

            try {
                
                value = parseInt(value);
            
                if (value < 0 || value >= 60) {
                    return false;
                }
                setData({ ...data, [id]: value})

            } catch (error) {
                console.log(error);
            }
        
        // start time & end time
        } else {
            setData({ ...data, [id]: value + ":00"})
        }
    }

    useEffect(() => {

        if (grace_before_start_time > 0 || grace_before_start_time <= 60 || !grace_before_start_time) {

            let new_am_in = subtractMinute(am_start_time, grace_before_start_time) + " - " + am_start_time;
            let new_pm_in = subtractMinute(pm_start_time, grace_before_start_time) + " - " + pm_start_time;
            
            if (new_am_in !== am_in && new_pm_in !== pm_in) {
                setData({ 
                    ...data, 
                    am_in: new_am_in,
                    pm_in: new_pm_in
                })
            }
            
        }

    }, [ grace_before_start_time, am_start_time, pm_start_time, data ])

    useEffect(() => {

        // if (grace_after_start_time > 0 || grace_after_start_time <= 60 || !grace_after_start_time) {
           
        //     let am_late1 = addSecond(am_start_time, 1)
        //     let am_late2 = addMinute(am_late1, grace_after_start_time);
        //     am_late2 = !grace_after_start_time || grace_after_start_time === 0 ? am_late2 : substractSecond(am_late2, 1);
        //     let am_absent1 = addSecond(am_late2, 1);
        //     let pm_late1 = addSecond(pm_start_time, 1);
        //     let pm_late2 = addMinute(pm_late1, grace_after_start_time);
        //     pm_late2 = !grace_after_start_time || grace_after_start_time === 0 ? pm_late2 : substractSecond(pm_late2, 1);
        //     let pm_absent1 = addSecond(pm_late2, 1);

        //     setData({ 
        //         ...data, 
        //         am_late: am_late1 + " - " + am_late2,
        //         am_absent: am_absent1 + " - " + am_end_time,
        //         pm_late: pm_late1  + " - " + pm_late2,
        //         pm_absent: pm_absent1 + " - " + pm_end_time,
        //     })  
        // } else {
        //     setData({   ...data, grace_after_start_time: 0 })
        // }
        
    }, [ grace_after_start_time, am_end_time, am_start_time, pm_end_time, pm_start_time, data ])

    useEffect(() => {

        // if (am_late) {
        //     if (grace_before_end_time > 0 || grace_before_end_time <= 60 || !grace_before_end_time) {

        //         let am_late2 = am_late.split(" - ")[1];
        //         let am_absent1 = addSecond(am_late2, 1);
        //         let am_absent2 = subtractMinute(am_end_time, grace_before_end_time);
        //         let am_undertime1 = addSecond(am_absent2, 1);
        //         let am_undertime2 = substractSecond(am_end_time, 1);
        //         let pm_late2 = pm_late.split(" - ")[1];
        //         let pm_absent1 = addSecond(pm_late2, 1);
        //         let pm_absent2 = subtractMinute(pm_end_time, grace_before_end_time);
        //         let pm_undertime1 = addSecond(pm_absent2, 1);
        //         let pm_undertime2 = substractSecond(pm_end_time, 1);

        //         let new_am_absent = am_absent1 + " - " + am_absent2;
        //         let new_am_undertime = am_undertime1 + " - " + am_undertime2;
        //         let new_pm_absent = pm_absent1 + " - " + pm_absent2;
        //         let new_pm_undertime = pm_undertime1 + " - " + pm_undertime2;    
                
        //         if (new_am_absent !== am_absent && new_am_undertime !== am_undertime && new_pm_undertime !== pm_undertime && new_pm_absent !== pm_absent) {
        //             setData({ 
        //                 ...data, 
        //                 am_absent: new_am_absent,
        //                 am_undertime: new_am_undertime,
        //                 pm_absent: new_pm_absent,
        //                 pm_undertime: new_pm_undertime,
        //             })  
        //         }
        //     }
        // }

    }, [ grace_before_end_time, am_late, am_end_time, data, pm_end_time, pm_late ])

    useEffect(() => {

        if (grace_after_end_time > 0 || grace_after_end_time <= 60 || !grace_after_end_time) {

            let am_out1 = addSecond(am_end_time, 1);
            let am_out2 = substractSecond(am_out1, 1);
            am_out2 = addMinute(am_out2, grace_after_end_time);

            let pm_out1 = addSecond(pm_end_time, 1);
            let pm_out2 = substractSecond(pm_out1, 1);
            pm_out2 = addMinute(pm_out2, grace_after_end_time);

            const new_am_out = am_out1 + " - " + am_out2;
            const new_pm_out = pm_out1 + " - " + pm_out2;

            if (am_out !== new_am_out && pm_out !== new_pm_out) {
                setData({ 
                    ...data, 
                    am_out: new_am_out,
                    pm_out: new_pm_out
                }) 
            }
        }

    }, [ grace_after_end_time, data, am_end_time, pm_end_time ])

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.patch(getHost() + "/api/settings/update/", {
            grace_before_start_time: grace_before_start_time,
            grace_after_start_time: grace_after_start_time,
            grace_before_end_time: grace_before_end_time,
            grace_after_end_time: grace_after_end_time,
            am_in: am_in,
            am_late: am_late,
            am_absent: am_absent,
            am_undertime: am_undertime,
            pm_in: pm_in,
            pm_late: pm_late,
            pm_undertime: pm_undertime,
        })
        .then(response => {
            // const { data } = response.data;
            console.log(data);
            // alert("Settings updated successfully!")
        })
    }

    const styles = {
        form: {
            width: '50%',
        }
    }

    return (
        <div className="AttendanceSettings bg-white p-3">
            <div className="row">
                <div className="col-lg-12">
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label><b>Morning { "from: " + am_start_time + " , to: " + to24Hour(am_start_time)}</b></label>
                        <div className="form-group">
                            <label>Start Time: </label>
                            <input 
                                type="time" 
                                id="am_start_time" 
                                value={to24Hour(am_start_time)} 
                                onChange={handleInputChange}
                            />
                            <label> End Time: </label>
                            <input 
                                type="time" 
                                id="am_end_time" 
                                value={to24Hour(am_end_time)} 
                                onChange={handleInputChange}
                            />
                            <hr />
                        </div>
                        <label><b>Afternoon</b></label>
                        <div className="form-group">
                            <label>Start Time: </label>
                            <input 
                                type="time" 
                                id="pm_start_time" 
                                value={to24Hour(pm_start_time)} 
                                onChange={handleInputChange}
                            />
                            <label> End Time: </label>
                            <input 
                                type="time" 
                                id="pm_end_time" 
                                value={to24Hour(pm_end_time)} 
                                onChange={handleInputChange}
                            />
                            <hr />
                        </div>
                        <label><b>Grace</b></label>
                        <div className="form-group">
                            <label>Before start time: </label>
                            <input 
                                type="number" 
                                id="grace_before_start_time" 
                                value={to24Hour(grace_before_start_time)} 
                                onChange={handleInputChange}
                            />
                            <span> min(s)</span>
                            <hr />
                        </div>
                        <div className="form-group">
                            <label>After start time: </label>
                            <input 
                                type="number" 
                                id="grace_after_start_time" 
                                value={to24Hour(grace_after_start_time)} 
                                onChange={handleInputChange}
                            />
                            <span> min(s)</span>
                            <hr />
                        </div>
                        <div className="form-group">
                            <label>Before end time: </label>
                            <input 
                                type="number" 
                                id="grace_before_end_time" 
                                value={to24Hour(grace_before_end_time)} 
                                onChange={handleInputChange}
                            />
                            <span> min(s)</span>
                            <hr />
                        </div>
                        <div className="form-group">
                            <label>After end time: </label>
                            <input 
                                type="number" 
                                id="grace_after_end_time" 
                                value={to24Hour(grace_after_end_time)} 
                                onChange={handleInputChange}
                            />
                            <span> min(s)</span>
                            <hr />
                        </div>
                        <div className="text-end w:100">
                            <CancelButton text="Reset" onClick={() => fetchData()} />
                            <SubmitButton text="Save" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}