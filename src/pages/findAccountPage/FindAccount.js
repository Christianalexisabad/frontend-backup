import SubmitButton from "../../components/forms/submitButton/SubmitButton";
import DialogBox from "../../components/forms/dialogBox/DialogBox";
import CancelButton from "../../components/forms/cancelButton/CancelButton";
import Input from "../../components/forms/input/Input";
import { getHost } from "../../utility/APIService";
import "./FindAccount.css";
import axios from "axios";
import React from "react";
import Title from "../../components/forms/title/Title";

class FindAccount extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            name: "",
            message: "",
            prevPath: "",
            isSuccess: false,
        }
    }

    componentDidMount() {
        const { params } = this.props.match;
        this.setState(params)
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            message: "",
            [e.target.id]: e.target.value
        });
    }

    handleClearInput = (e) => {
        this.setState({ [e.target.id]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { isSuccess, username } = this.state

        if(username){
            if(!isSuccess){
                axios.get(getHost() + "/api/users/get/"+username+"/")
                .then(res => {

                    this.setState({ 
                        isSuccess: true,
                        message: "",
                        email: res.data.email
                    })

                }).catch(err => {
                    this.setState({
                        imageDisplay: "none",
                        message: err.response.data.message,
                    })
                })
            } else {
                axios.post(getHost() + "/api/send-mail/", {
                    "subject": "Hello",
                    "message": "Hi Abad",
                    "from": "christianalexes@gmail.com",
                    "to": ["alunanrochelle@gmail.com"]
                })
            }
        } else {      
            this.setState({ message: "Please enter your username" })
        }
    }

    handleOptions = (e) => {
        e.preeventDefault();
    }   

    render(){
        const { isSuccess, message, username, email } = this.state;
        return (
            <section className="FindAccount">
                <div className="container bg-white">
                    <div className="row">
                        <div className="col-lg-12">
                            <Title 
                                text="Find Account" 
                            />
                        </div>   
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <form onSubmit={this.handleSubmit}>
                                <DialogBox 
                                    message={message}
                                    isSuccess={isSuccess}
                                    onClose={() => this.setState({ message: "" })}
                                />
                                <Input 
                                    type="text" 
                                    id="username" 
                                    value={username} 
                                    placeholder="Username" 
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <div className="btnContainer">
                                    <SubmitButton 
                                        icon={email ? null : "fa fa-search"}
                                        text={email ? "Send" : "Search"} 
                                    />
                                    <CancelButton icon={false} onClick={() => this.props.history.goBack()} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


    
export default FindAccount;