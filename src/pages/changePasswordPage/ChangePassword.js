import CancelButton from "../../components/forms/cancelButton/CancelButton";
import SubmitButton from "../../components/forms/submitButton/SubmitButton";
import DialogBox from "../../components/forms/dialogBox/DialogBox";
import Password from "../../components/forms/password/Password";
import Input from "../../components/forms/input/Input";
import Title from "../../components/forms/title/Title";
import { getHost } from "../../utility/APIService";
import { isPassword } from "../../utility/Regex";
import "./ChangePassword.css";
import axios from "axios";
import React from "react";

class ChangePassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            text: "Confirm",
            message: "",
            username: "",
            password: "",
            newPassword: "",
            confirmPassword: "",
            prevPath: "",
            isSuccess: false,
        }
    }

    componentDidMount() {
        const { params } = this.props.match;
        this.setState(params);
    }

    setMessage(message,status) {
        this.setState({ message: message, isSuccess: status === 200 ? true : false})
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            message: "",
            [e.target.id]: e.target.value
        });
    }

    handleClearInput = (e) => {
        e.preventDefault();
        alert(e.target.id);
        this.setState({
            [e.target.id]: ""
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(!this.state.isSuccess){

            const { username, password, newPassword, confirmPassword } = this.state;

            if (!username) {
                this.setMessage("Please enter your username.");
                return false;
            } else if (!password) {
                this.setMessage("Please enter your password.");
                return false;
            } else if (!newPassword) {
                this.setMessage("Please enter your new password.");
                return false;
            } else if (!isPassword(newPassword)) {
                this.setMessage("Please enter valid password.");
                return false;
            } else if (!confirmPassword) {
                this.setMessage("Please confirm your password.");
                return false;
            } else if (newPassword !== confirmPassword) {
                this.setMessage("Password does not match.");
                return false;
            }
        
            axios.patch(getHost() + "/api/users/update-password/", {
                username: username,
                password: password,
                new_password: newPassword,
            })
            .then(res => {
                this.setMessage(res.data.message, res.status);
                this.setState({ text: "Login" })
            }).catch(err => {
                this.setMessage(err.response.data.message);
            })
        } else {
            this.props.history.push("/");
        }
    }

    render(){
        return (
            <section className="ChangePassword">
                <div className="container bg-white">
                    <div className="row">
                        <div className="col-lg-12">
                            <Title 
                                text="Change Password"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <form onSubmit={this.handleSubmit}>
                                <DialogBox 
                                    message={this.state.message} 
                                    isSuccess={this.state.isSuccess}
                                />
                                <Input
                                    type="text" 
                                    id="username" 
                                    label="Username"
                                    value={this.state.username} 
                                    placeholder="Username" 
                                    disabled={true}
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <Password 
                                    id="password" 
                                    label="Password"
                                    value={this.state.password} 
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <Password 
                                    id="newPassword" 
                                    label="New Password"
                                    value={this.state.newPassword} 
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <Password 
                                    id="confirmPassword" 
                                    label="Confirm Password"
                                    value={this.state.confirmPassword} 
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <div className="btnContainer text-end">
                                    { !this.state.isSuccess && <CancelButton text="Cancel" onClick={() => this.props.history.goBack()} /> }
                                    <SubmitButton isSuccess={this.state.isSuccess} text={this.state.text} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )   
    }
}
    
export default ChangePassword;