import Announcement from '../../../../announcement/Announcement';
import { isPath } from '../../../../../../utility/Functions';
import React from 'react';
import './EmployeeDashboard.css';
import DaysPresent from "./components/DaysPresent";
import DaysAbsent from "./components/DaysAbsent";
import DaysLate from "./components/DaysLate";
import DaysOnLeave from "./components/DaysOnLeave";
import MonthlyAttendance from "./components/monthlyAttendance/MonthlyAttendance";

const EmployeeDashboard = () => {

    const display = isPath("/pages/employee%20dashboard/");

    return (
        display &&
        <div className="EmployeeDashboard">
            <div className="row">
                <div className="col-lg-8 p-0">
                    <div className="row">
                        <div className="col-lg-12">
                            <DaysPresent />
                            <DaysLate />
                            <DaysOnLeave />
                            <DaysAbsent />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 p-0">
                    <Announcement />
              </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <MonthlyAttendance />
                </div>
            </div>
        </div> 
    )
}

export default EmployeeDashboard;