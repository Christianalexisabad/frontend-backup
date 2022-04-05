import SuperAdminDashboard from "./components/dashoard/SuperAdminDashboard/SuperAdminDashboard";
import EmployeeDashboard from "./components/dashoard/EmployeeDashboard/EmployeeDashboard";
import EmployeeProfile from "./components/employeeProfile/EmployeeProfile";
import HRDashboard from "./components/dashoard/HRDashboard/HRDashboard";
import UserActivity from "./components/table/UserActivity";
import OfficeSupply from "./components/table/OfficeSupply";
import LoginHistory from "./components/table/LoginHistory";
import DepartmentFile from "./components/table/DepartmentFile";
import EmployeeBenefit from "./components/table/EmployeeBenefit";
import Position from "./components/table/Position";
import Department from "./components/table/Department";
import Report from "./components/table/Report";
import MyFile from "./components/table/MyFile";
import EmployeeAttendance from "./components/table/EmployeeAttendance";
import UserProfile from "../edit/UserProfile";
import AdminDashboard from "./components/dashoard/adminDashboard/AdminDashboard";
import InventoryDashboard from "./components/dashoard/InventoryDashboard/InventoryDashboard";
import MyProfile from "./components/myProfile/MyProfile";
import HRSettings from "./components/settings/HRSettings";
import InventorySettings from "./components/settings/InventorySettings";
import Equipment from "./components/table/Equipment";
import UserSettings from "./components/settings/UserSettings";
import AttendanceModule from "./components/attendanceModule/AttendanceModule";
import UserModule from "./components/users/Users";
import Account from "./components/account/Account";
import LeaveModule from "./components/leaveModule/leaveModule";
import BenefitModule from "./components/benefitModule/BenefitModule";
import EmployeeLeave from "./components/table/EmployeeLeave";
import Employee from "./components/employee/Employee";
import { toCapitalized } from "../../../utility/Functions";
import HelpButton from "../../forms/helpButton/HelpButton";
import { useHistory, useLocation, useParams } from "react-router-dom";
import React from "react";
import "./Main.css";

const Main = () => {

    let { pathname } = useLocation();
    let { session_id } = useParams();
    const history = useHistory();
    
    const paths = pathname.replace(session_id, "").replace("/pages/", "").split("/");
    paths.pop(paths.length-1);

    function renderHeader() {
        return (
            <div className="header">  
                <ul className="list"> 
                    {paths.map((item, index) => {

                    let text = toCapitalized(item).replace("Hr", "HR");
                    const lastIndex = paths.length - 1;

                        return (
                            <li className="listItem" key={index}>
                                { index === lastIndex ?
                                    <b>{text}</b> : 
                                    <button onClick={()=> {

                                        if (index > 0 || index < lastIndex) {
                                            text = text.toLowerCase();
                                            pathname = pathname.split(text)
                                            history.push(pathname[0] + text + "/" + session_id);     
                                        }
                                       
                                    }}>
                                        <span>{text}</span>
                                    </button>
                                }
                                {
                                    index !== lastIndex && <i className="fa fa-angle-right" />
                                }
                            </li>
                        )   
                    })}
                </ul>
            </div>
        )
    }
    return (
        <div className="Main">
            <div className="row">
                <div className="col-lg-12">
                    {renderHeader()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <SuperAdminDashboard />
                    <Employee />
                    <EmployeeDashboard />
                    <AdminDashboard />
                    <HRDashboard />
                    <InventoryDashboard />
                    <Department />
                    <Position />
                    <MyProfile />
                    <LeaveModule />
                    <BenefitModule />
                    <AttendanceModule />
                    <EmployeeProfile />
                    <EmployeeAttendance />
                    <EmployeeLeave/>
                    <EmployeeBenefit />
                    <UserModule /> 
                    <UserProfile />
                    <MyFile />
                    <DepartmentFile />
                    <OfficeSupply />
                    <Equipment />
                    <LoginHistory />
                    <UserActivity />
                    <Report />
                    <HRSettings />
                    <InventorySettings  />
                    <UserSettings  />
                    <Account /> 
                    <HelpButton
                        permission="can_report_problem"
                    />
                </div>
            </div>
        </div>
    )   
}

export default Main;