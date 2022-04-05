import Announcement from '../../../../announcement/Announcement';
import { isPath } from '../../../../../../utility/Functions';
import React from 'react';
import './HRDashboard.css';
import GenderRatio from "./components/GenderRatio";
import EmployeeType from "./components/EmployeeType";
import AgeRatio from "./components/AgeRatio";
import YearlyEmployees from "./components/yearlyEmployees/YearlyEmployees";
// import DailyAttendance from "./components/row-1/column-left/DailyAttendance";
import Departments from "./components/row-1/column-left/Departments";
import Employees from "./components/row-1/column-left/Employees";
import Positions from "./components/row-1/column-left/Positions";
import Present from "./components/row-1/column-left/Present";
import TotalAbsent from "./components/row-1/column-left/TotalAbsent";
import OnLeave from "./components/row-1/column-left/OnLeave";
import Users from "./components/row-1/column-left/Users";
import Lates from "./components/row-1/column-left/Lates";

const HRDashboard = () => {

    const display = isPath("/pages/hr%20dashboard/");

    return (
        display &&
        <div className="HRDashboard">
            <div className="row row-1">
                <div className="col-lg-8 p-0 column-left">
                    <div className="row">
                        <div className="col-lg-12">
                            <Departments />
                            <Positions />
                            <Employees />
                            <Users />
                            <Present />
                            <Lates />
                            <OnLeave />
                            <TotalAbsent />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 p-0">
                    <Announcement/>
              </div>
            </div>
            <div className="row">
                <div className="col-lg-4">
                    <GenderRatio />
                </div>
                <div className="col-lg-4">
                    <AgeRatio />
                </div>
                <div className="col-lg-4">
                    <EmployeeType />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 p-3">
                    <YearlyEmployees />
                </div>
                <div className="col-lg-6 p-3">
                    {/* <DailyAttendance  /> */}
                </div>
            </div>
        </div> 
    )
}

export default HRDashboard;