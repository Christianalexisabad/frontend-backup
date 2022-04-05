import SubmitButton from '../../components/forms/submitButton/SubmitButton';
import DialogBox from "../../components/forms/dialogBox/DialogBox";
import Password from '../../components/forms/password/Password';
import Input from '../../components/forms/input/Input';
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import React from "react";
import "./LoginPage.css";
import * as Session from '../../utility/Session';
import { setDashboardID } from '../../utility/Functions';
import { createUserAcitivity, getHost } from '../../utility/APIService';
import { encrypt } from '../../utility/Encryption';

export default class LoginPage extends React.Component {

    constructor(props) {    

        super(props);

        this.state = {
            now: new Date(),
            message: "",
            username: "",
            password: "",
            isSuccess: false,
        };
    }

    componentDidMount() {
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value,
            message: ""
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { username, password } = this.state;
        const { history } = this.props;

            Session.login(username, password)
            .then(response => {

                const { session_id } = response.data;

                Session.fetchUserInfo(session_id).then(response => {

                    const { session_id, session_data } = response.data;

                    // session data
                    const { user_info, expiry } = session_data;

                    // user information
                    let { id, role, image, email, sur_name, first_name, employee } = user_info;

                    setDashboardID(role);  

                    localStorage.setItem("position", encrypt(role.title))
                                        
                    let user_type = role.user_type.id;
                    role = role.id;

                    let dashboardName = "";
                    let dashboardID = "";
                    let path = ""
                    
                    if (user_type === 1) {
                        dashboardName = "Dashboard";
                        dashboardID = "can_access_super_admin_dashboard";
                        path = "/pages/super admin dashboard/";
                    }else if (user_type === 2 && role === 2) {
                        dashboardName = "Admin Dashboard"
                        dashboardID = "can_access_admin_dashboard";
                        path = "/pages/admin dashboard/";
                    }else if (user_type === 2 && role === 3) {
                        dashboardName = "HR Dashboard"
                        dashboardID = "can_access_hr_dashboard_module";
                        path = "/pages/hr dashboard/";
                    }else if (user_type === 2 && role === 4) {
                        dashboardName = "Inventory Dashboard"
                        dashboardID = "can_access_inventory_dashboard";
                        path = "/pages/inventory dashboard/";
                    } else {
                        dashboardName = "Employee Dashboard"
                        dashboardID = "can_access_employee_dashboard";
                        path = "/pages/employee dashboard/";
                    }

                    path = path + session_id;

                    localStorage.setItem("dashboardID", dashboardID)
                    localStorage.setItem("dashboardName", dashboardName)
                    localStorage.setItem("sessionID", encrypt(session_id));
                    localStorage.setItem("userType", encrypt(user_type.toString()));
                    localStorage.setItem("role", encrypt(role.toString()));
                    localStorage.setItem("userID", encrypt(id.toString()));
                    employee && localStorage.setItem("employeeID", encrypt(employee.toString()));
                    localStorage.setItem("username", encrypt(username));
                    localStorage.setItem("expiry", encrypt(expiry));
                    localStorage.setItem("imageURL", encrypt(getHost() + image));
                    localStorage.setItem("surName", encrypt(sur_name));
                    localStorage.setItem("firstName", encrypt(first_name));
                    localStorage.setItem    ("email", encrypt(email));
                    localStorage.setItem("dashboardPathname", encrypt(path.toLowerCase()))

                    Session.createLoginHistory(username);
                    createUserAcitivity(id, "Login", "Login", "Logged In Successfully");
                    Session.loginUser(username);

                    history.push(path);
                })
                .catch(err => {
                })
            })
            .catch(err => {

                alert(err)
                // err.response.status === 409 && history.push("/pages/change password/" + username);
            
                this.setState({ 
                    isSuccess: false,
                    message: err.response.data.message
                });
            })
    };

    render() {
        return (
            <section className="LoginPage">
                <div className="container">
                    <div className="row row-1 header">
                        <div className="column col-lg-2 col-left">
                            <img src={logo} alt="" />
                        </div>
                        <div className="column col-lg-10 col-right">
                            <h1 className="title">eCandoni</h1>
                            <hr className="text-success"/>
                            <h4 className="subTitle">Office Information System for Candoni Municipality</h4>
                        </div>
                    </div>
                    <div className="row row-2">
                        <div className="col-lg-12">
                            <center>
                                <form onSubmit={this.handleSubmit} className="bg-white">
                                    <div className="row">
                                        <div className="col-lg-12"> 
                                            <h4 className="title text-start"> Login </h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12"> 
                                            <DialogBox 
                                                message={this.state.message} 
                                                isSuccess={this.state.isSuccess}
                                                onClose={()=> this.setState({ message: "" })}
                                            />
                                            <Input
                                                id="username" 
                                                type="text" 
                                                label="username"
                                                autocomplete="off"
                                                value={this.state.username} 
                                                onChange={this.handleInputChange} 
                                            />
                                            <Password
                                                value={this.state.password} 
                                                onChange={this.handleInputChange} 
                                            />
                                            <SubmitButton 
                                                disabled={!this.state.password || !this.state.username ? true : false}
                                                icon="fa fa-sign-in"
                                                text="Login"
                                            />
                                            <p className="forgot-password">
                                                <span> Forgot password? </span>
                                                <Link className="link" to="/find account/"> 
                                                    Click here!
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </center>
                        </div>
                    </div>
                </div>
            </section>
        )
        
    }
 }
