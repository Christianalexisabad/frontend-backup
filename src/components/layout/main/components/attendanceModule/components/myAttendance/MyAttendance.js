
import SearchBar from "../../../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../../../utility/APIService";
import Print from "../../../../../../forms/printButton/PrintButton";
import Entries from "../../../../../../forms/entries/Entries";
import AttendanceFilter from "../../../../../../forms/attendanceFilter/AttendanceFilter";
import React, { useState, useEffect, useCallback } from "react";
import Title from "../../../../../../forms/title/Title";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import "./MyAttendance.css";
import { getCurrentDate, isTimeGreaterThanOrEqual, isTimeLessThan, isTimeLessThanOrEqual, isTimeRange } from "../../../../../../../utility/DateTime";
import { getEmployeeID } from "../../../../../../../utility/Session";
import SubmitButton from "../../../../../../forms/submitButton/SubmitButton";
import AlertMessage from "../../../../../../forms/alert/AlertMessage";
import { getAttendanceStatus } from "../../../../../../../utility/Functions";
import CancelButton from "../../../../../../forms/cancelButton/CancelButton";
import TableFooter from "../../../table/components/TableFooter";

export default function MyAttendance(props) {

    const employee = getEmployeeID();
    const HOST = getHost();
    const defaultPath = "attendances/employee="+ employee +"/";
    const [path, setPath] = useState("");
    const [order, setOrder] = useState("");

    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const [attendance, setAttendance] = useState({});
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [Settings, setSettings] = useState({});
    const currentDate = getCurrentDate();
    let currentTime = "01:01:00 PM";

    const styles = {
        tableContainer:{ 
            maxHeight: window.innerHeight - (window.innerHeight * 0.50) 
        }
    }    

    const fetchAttendance = useCallback(async () => {
        try {
            const response = await axios.get(HOST + "/api/attendances/get/" + employee + "/"+ currentDate +"/")
            const { data } = await response.data;
            setAttendance(data);   
        } catch (error) {
            // error.response.status === 404 && console.clear();   
        }
    }, [ HOST, employee, currentDate ]);

    const fetchSettings = useCallback(async () => {
        const response = await axios.get(HOST + "/api/settings/")
        const { data } = await response.data;
        setSettings(data[0]);
    }, [ HOST ])

    const fetchData = useCallback(async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST, path ]);

    useEffect(() => {
        fetchAttendance();
        fetchSettings();
    }, [ fetchAttendance, fetchSettings ]);

    const initialData = {
        filterValue: 3, 
        status: "",
        startDate: currentDate, 
        endDate: currentDate,
    }
    const [filterData, setFilterData] = useState(initialData);

    const handleFilterChange = (e) => {
        e.preventDefault();
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }

    let { status, startDate, endDate } = filterData;

    const [isClockIn, setClockIn] = useState(true);

    let { id, am_in, am_out, pm_in, pm_out, am_status, pm_status } = attendance;

    useEffect(() => {

        let newPath = "";

        let date_range = startDate + ":" + endDate;

        newPath = status && startDate && endDate && order ? "status=" + status + "/date_range=" + date_range + "/order=" + order + "/": 
                  status && startDate && endDate ? "status=" + status + "/date_range=" + date_range + "/" : 
                  startDate && endDate && order ? "date_range=" + date_range + "/order=" + order + "/" :  
                  startDate && endDate ? "date_range=" + date_range + "/" : 
                  status && order ? "status=" + status + "/order=" + order + "/" :
                  status ? "status=" + status + "/" : ""

        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [status, startDate, endDate, order, defaultPath]);

    useEffect(() => {
        path && fetchData();
    }, [path, fetchData ]);

    useEffect(() => {

        if ((am_in && !am_out) || (pm_in && !pm_out)) {
            setClockIn(false);
        } else {
            setClockIn(true);
        }

    }, [am_in, am_out, pm_in, pm_out])

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    }

    const handleEntry = (e) => {
        e.preventDefault();
        setEntry(parseInt(e.target.value));
    }

     const handleSort = (e) => {
        e.preventDefault();
        let id = e.target.id;
        let order = id.startsWith("-") ? id.replace("-", "") : "-" + id;
        e.target.id = order;
        setOrder(order);
    }

    function patchData(toUpdate) {

        toUpdate['employee'] = employee;
        axios.patch(getHost() + "/api/attendances/update/" + id + "/", toUpdate)
        .then(res => {
            fetchAttendance();
            fetchData();
        })
    }   

    function postData(toPost) {

        toPost['date'] = currentDate;
        toPost['employee'] = employee;

        axios.post(getHost() + "/api/attendances/new/", toPost)
        .then(response => {
            fetchAttendance();
            fetchData();
        })
    }   

    const handleClockIn = (e) => {
        e.preventDefault();

        const amIn = Settings.am_in.split(" - ");
        const amLate = Settings.am_late.split(" - ");
        const amAbsent = Settings.am_absent.split(" - ");
        const amUndertime = Settings.am_undertime.split(" - ");
        const amOut = Settings.am_out.split(" - ");
        const pmIn = Settings.pm_in.split(" - ");
        const pmLate = Settings.pm_late.split(" - ");
        const pmAbsent = Settings.pm_absent.split(" - ");
        const pmUndertime = Settings.pm_undertime.split(" - ");
        const { am_end_time, pm_end_time } = Settings;

        const isAM = currentTime.search("AM") > -1 ? true : false;
        let status = "";

        if (id === undefined) {

            if (isAM) {

                if (isTimeLessThan(currentTime, amIn[0])) {
                    setMessage("AM Clock-in starts at " + amIn[0]);
                    return false;
                }   

                // present
                if ((isTimeGreaterThanOrEqual(currentTime, amIn[0]) && isTimeLessThanOrEqual(currentTime, amIn[1])) || (isTimeGreaterThanOrEqual(currentTime, am_end_time) && isTimeLessThanOrEqual(currentTime, pmIn[1]))) {
                    status = 1
                } 
                // late
                else if (isTimeGreaterThanOrEqual(currentTime, amLate[0]) && isTimeLessThanOrEqual(currentTime, amLate[1])) {
                    status = 2
                }
                // absent
                else {
                    status = 4
                }

                // insert data
                postData({
                    am_in: currentTime,
                    am_status: status,
                })

            } else {

                // PM Clock-in period error message
                if(isTimeLessThan(currentTime, pmIn[0])) {
                    setMessage("PM Clock-in starts at " + pmIn[0] + ".");
                    return false;
                }

                if ((isTimeGreaterThanOrEqual(currentTime, pmIn[0]) && isTimeLessThanOrEqual(currentTime, pmIn[1])) || (isTimeGreaterThanOrEqual(currentTime, pm_end_time) && isTimeLessThanOrEqual(currentTime, pmIn[1]))) {
                    status = 1
                } else if (isTimeGreaterThanOrEqual(currentTime, pmLate[0]) && isTimeLessThanOrEqual(currentTime, pmLate[1])) {
                    status = 2
                } else {
                    status = 4
                } 

                postData({
                    am_status: 4,
                    pm_in: currentTime,
                    pm_status: status,
                })
            }

        } else {
        
            if (isAM) {

                // display error message if time is less than PM Clock in
                if (am_in && am_out) {
                    setMessage("PM Clock-in starts at " + pmIn[0]);
                    return false;
                } else if (am_in && am_out && (!pm_in && !pm_out)) {
                    setMessage("PM Clock-in starts at " + pmIn[0]);
                    return false;
                }  
                
                if (isTimeLessThanOrEqual(currentTime, amAbsent[1]) || status === 4) {
                    status = 4;
                } else if (isTimeGreaterThanOrEqual(currentTime, amUndertime[0]) && isTimeLessThanOrEqual(currentTime, amUndertime[1])) {
                    status = 5;
                } 

                patchData({
                    am_out: currentTime,
                    am_status: status,
                })

            // PM
            } else {

                if (pm_in && pm_out) {
                    setMessage("Today's attendance is complete.");
                    return false;
                } 
                
                if (isTimeRange(currentTime, amOut[0], amOut[1]) && (!am_status || !am_out)) { 
                
                    patchData({
                        am_out: currentTime,
                        am_status: 1
                    })

                } else {

                    // if employee haven't clocked in at PM
                    if (!pm_in) {

                        if (isTimeRange(currentTime, pmIn[0], pmIn[1])) {
                            status = 1;
                        } 

                        if (isTimeRange(currentTime, pmLate[0], pmLate[1])) {
                            status = 2;
                        }

                        if (isTimeGreaterThanOrEqual(currentTime, pmAbsent[0])) {
                            status = 4;
                        }

                    } else {

                        if (isTimeRange(currentTime, pmIn[1], pmAbsent[1])) {
                            status = 4;
                        } 

                        if (isTimeRange(currentTime, pmUndertime[0], pmUndertime[1])) {
                            status = 4;
                        } 
                        console.log(pmUndertime);

                    }

                    patchData(!pm_in ? {
                        pm_in: currentTime, 
                        pm_status: status,
                    } : pm_status !== 4 ? {
                        pm_out: currentTime,
                        pm_status: status,
                    }: {
                        pm_out: currentTime,
                        pm_status: status,
                    });
                }
            }
        }
    }

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                    <div className="col-left col-lg-6">
                        <Title  
                            text="Attendance"
                        />
                        {isClockIn ? <SubmitButton  
                            text="Clock-In"
                            type="button"
                            color="rgb(50, 150, 50)"
                            onClick={handleClockIn}
                            /> : <SubmitButton  
                            text="Clock-Out"
                            type="button"
                            color="rgb(200, 50, 50)"
                            onClick={handleClockIn}
                        />}
                        <CancelButton  
                            text="Clear"
                            onClick={() => {
                                axios.delete(HOST + "/api/attendances/delete/")
                                .then(res => {
                                    fetchAttendance();
                                    fetchData();
                                })
                            }}
                        />
                        <Button 
                            type="button"
                            icon="fa fa-refresh"
                            onClick={
                                () => {
                                    setSearchTerm("");
                                    fetchAttendance();
                                    fetchData();
                                }
                            }
                        />
                    </div>
                    <div className="col-right col-lg-6">
                        <SearchBar 
                            value={searchTerm}
                            onClear={() => setSearchTerm("")}
                            onChange={handleSearchBarChange}
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-6">
                        <Entries 
                            value={entry}
                            entries={data.length}
                            onChange={handleEntry}
                        />
                    </div>
                    <div className="col-right col-lg-6">
                        <Print 
                            employeeID={employee}
                            table="my attendance"
                            title="Attendance List"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <AttendanceFilter 
                            data={filterData}
                            onChange={handleFilterChange}
                            onClear={()=> setFilterData(initialData)}                                
                        />
                    </div>
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "ID" },
        { id: "am_in", name: "AM In" },
        { id: "am_out", name: "AM Out" },
        { id: "am_status", name: "status" },
        { id: "pm_in", name: "PM In" },
        { id: "pm_out", name: "PM Out" },
        { id: "pm_status", name: "Status" },
        { id: "date", name: "Date" },
    ]

    function renderTableHeader() {
        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{item.name}</span>
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                let { id, date, am_in, am_out, am_status, pm_in, pm_out, pm_status } = item;

                return (
                    index < entry &&
                    <tr key={index}>
                        <td>{id}</td>
                        <td>{am_in ? am_in : "---"}</td>
                        <td>{am_out ? am_out : "---"}</td>
                        <td>{getAttendanceStatus(am_status)}</td>
                        <td>{pm_in ? pm_in : "---"}</td>
                        <td>{pm_out ? pm_out : "---"}</td>
                        <td>{pm_status}</td>
                        <td>{date}</td>
                    </tr>
                )

                }) : <tr>
                    <td colSpan={header.length} className="text-secondary text-center"> No records found </td>
                </tr>
                }
            </tbody>
        )
    }

    function renderTable() {
        return (
            <table className="table">
                {renderTableHeader()}
                {renderTableBody()}
            </table>
        )
    }

    function renderContent (){
        return (
            <div className="content">
                <div className="row">
                    <div className="col-lg-12">            
                        <div className="tableContainer" style={styles.tableContainer}>
                            {renderTable()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="MyAttendance bg-white">
            <AlertMessage message={message} onClose={() => setMessage("")} />
            <div className="row">
                <div className="col-lg-12">
                    {renderHeader()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    {renderContent()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <TableFooter 
                        total={data.length}
                        current={entry}
                    />
                </div>
            </div>
        </div>
    )
}