import Announcement from '../../../../announcement/Announcement';
import { isPath } from '../../../../../../utility/Functions';
import React from 'react';
import './AdminDashboard.css';
import TotalEmployees from "./components/TotalEmployees";
import TotalPositions from "./components/TotalPositions";
import TotalDepartments from "./components/TotalDepartments.js";
import TotalUsers from "./components/TotalUsers";
import DailyAttendance from "./components/DailyAttendance/DailyAttendance";
import YearlyEmployees from "../HRDashboard/components/yearlyEmployees/YearlyEmployees";

const AdminDashboard = () => {

    const display = isPath("/pages/admin%20dashboard/");

    return (
        display &&
        <div className="AdminDashboard">
            <div className="row">
                <div className="col-lg-8 p-0">
                    <div className="row">
                        <div className="col-lg-12">
                            <TotalEmployees />
                            <TotalDepartments />
                            <TotalUsers />
                            <TotalPositions />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 p-0">
                    <Announcement />
              </div>
            </div>
            <div className="row">
                <div className="col-lg-6 p-3">
                    <YearlyEmployees />
                </div>
                <div className="col-lg-6 p-3">
                    <DailyAttendance />
                </div>
            </div>
        </div> 
    )
}

export default AdminDashboard;