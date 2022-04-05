import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChangePassword from './pages/changePasswordPage/ChangePassword';
import PrintPage from './pages/printPage/PrintPage';
import ReportProblem from './pages/ReportProblemPage/ReportProblem';
import FindAccountPage from './pages/findAccountPage/FindAccount';
import LoginPage from './pages/loginPage/LoginPage';
import PageNotFound from './pages/pageNotFound/PageNotFound';
import Home from './pages/home/Home';
import'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import './App.css';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {   
        };
    }

    render() {
        return (
            <div className="App bg-white">
                <Router>
                    <Switch>
                        <Route exact path="/pages/find account" component={FindAccountPage}/>
                        <Route exact path="/pages/change password/:username" component={ChangePassword}/>
                        <Route exact path='/pages/super admin dashboard/:session_id' component={Home}/>
                        <Route exact path='/pages/admin dashboard/:session_id' component={Home}/>
                        <Route exact path='/pages/hr dashboard/:session_id' component={Home}/>
                        <Route exact path='/pages/employee dashboard/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory dashboard/:session_id' component={Home}/>
                        <Route exact path='/pages/department/departments/:session_id' component={Home}/>
                        <Route exact path='/pages/department/departments/new/:session_id' component={Home}/>
                        <Route exact path='/pages/department/departments/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/department/positions/:session_id' component={Home}/>
                        <Route exact path='/pages/department/positions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/department/positions/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/my profile/:tab/:session_id' component={Home}/>
                        <Route exact path='/pages/attendance/:session_id' component={Home}/>
                        <Route exact path='/pages/attendance/clock in/:session_id' component={Home}/>
                        <Route exact path='/pages/leave/:session_id' component={Home}/>
                        <Route exact path='/pages/leave/leave application/:session_id' component={Home}/>
                        <Route exact path='/pages/benefits/:session_id' component={Home}/>
                        <Route exact path='/pages/benefits/new/:session_id' component={Home}/>
                        <Route exact path='/pages/benefits/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/employees/:employee/:tab/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/employees/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/employees/new/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/attendance/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/task/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/task/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/leave/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/benefits/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/benefits/new/:session_id' component={Home}/>
                        <Route exact path='/pages/employee/benefits/:session_id' component={Home}/>
                        <Route exact path='/pages/users/:session_id' component={Home}/>
                        <Route exact path='/pges/users/new/:session_id' component={Home}/>
                        <Route exact path='/pages/users/:username/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/office supply/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/office supply/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/office supply/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/office supply/request new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/equipment/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/equipment/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/equipment/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory/equipment/request new/:session_id' component={Home}/>
                        <Route exact path='/pages/file/my files/:session_id' component={Home}/>
                        <Route exact path='/pages/file/department files/:session_id' component={Home}/>
                        <Route exact path='/pages/history/login history/:session_id' component={Home}/>
                        <Route exact path='/pages/history/user activities/:session_id' component={Home}/>
                        <Route exact path='/pages/reports/:session_id' component={Home}/>
                        <Route exact path='/pages/reports/generate report/:session_id' component={Home}/>
                        <Route exact path='/pages/reports/upload report/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/roles/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/roles/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/groups/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/groups/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/groups/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user groups/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user groups/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user groups/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user permissions/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user permissions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user permissions/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/group permissions/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/group permissions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/group permissions/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/locations/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/locations/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/countries/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/countries/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/provinces/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/provinces/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/cities/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/cities/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/barangays/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/address/barangays/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/name extensions/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/name extensions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/civil statuses/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/civil statuses/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/blood types/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/blood types/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/citizenships/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/citizenships/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/government companies/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/general/government companies/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/employee types/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/employee types/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/salaries/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/salaries/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/leave types/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/leave types/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/leave detail options/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settings/employee data/leave detail options/:id/:session_id' component={Home}/><Route exact path='/pages/hr settings/employee data/leave balances/new/:session_id' component={Home}/>
                        <Route exact path='/pages/hr settingsemployee data/leave balances/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/types/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/types/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/articles/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/office supply/articles/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/types/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/types/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/articles/new/:session_id' component={Home}/>
                        <Route exact path='/pages/inventory settings/equipment/articles/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/roles/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/roles/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/groups/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/groups/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user groups/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user groups/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user permissions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/user permissions/:id/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/group permissions/new/:session_id' component={Home}/>
                        <Route exact path='/pages/user settings/group permissions/:id/:session_id' component={Home}/> 
                        <Route exact path='/pages/account/:session_id' component={Home}/>
                        <Route exact path='/pages/report problem/' component={ReportProblem}/>
                        <Route exact path='/pages/print/' component={PrintPage}/>
                        <Route exact path='/page not found' component={PageNotFound}/>
                        <Route exact path='/' component={LoginPage}/>
                        <Route component={PageNotFound}/>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;
