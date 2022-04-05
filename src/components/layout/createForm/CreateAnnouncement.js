import { hasIllegalCharacters, isEmail, isTelNo, isName } from "../../../utility/Regex";
import { getDateTime, toCapitalized, Name } from "../../../utility/Functions";
import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { getHost } from "../../../utility/APIService";
import DialogBox from "../../forms/dialogBox/DialogBox";
import Button from "../../forms/button/Button";
import Select from "../../forms/select/Select";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import "./Style.css";
import axios from "axios";
import React from "react";

export default class Create extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isSuccess: false,
            message: "",
        }
    }
    
    componentDidMount() {
    }

    handleInputChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        let type = e.target.type;
        let message = "";
        this.setState({
            [id] : value ? value : null,
            message : message,
        });     
    }

    setMessage = (message, status) => {
        this.setState({ 
            message: message, 
            isSuccess: status === 201 ? true : false 
        });
    }

    handleClearInput = (e) => {
        this.setState({ [e.target.id]: ""})
    }

    handleSubmit  = (e) => {   
        e.preventDefault();

        const { content } = this.state;

         if(!content) {
            this.setMessage("In.")            
        }else if(!location) {
            this.setMessage("Location is required.")            
        } else {
            
            data.append("name", name)
            data.append("supervisor", supervisor)
            data.append("location", location)
            data.append("email", email)
            data.append("tel_no", tel_no)
            data.append("image  ", image, image.name)
            data.append("date_created", getDateTime())
                
            axios.post(getHost() + "/api/announcements/", {
                content: content,
                date_created: getDateTime()
            })
            .then(res => {
                this.setMessage(res.data.message, res.status)

                setTimeout(() => this.setState({ 
                    message: "",
                    name: "",
                    supervisor: "",
                    location: "",
                    email: "",
                    tel_no: "",
                }), 2000)

            }).catch(err => {
                this.setMessage(err.response.data.message)
            })
        }
    }

    render(){
        return <section className="Create">
            <div className="row">
                <div className="col-lg-12 form-container">
                    <form className="bg-white">
                        <div className="row header">
                            <div className="col-lg-12">
                                <Title
                                    text="Create Announcement"
                                    fontSize="20px"
                                />
                            </div>
                        </div>
                        <div className="row row-2">
                            <div className="col-lg-12 DialogBoxContainer">
                                <DialogBox  
                                    message={this.state.message} 
                                    isSuccess={this.state.isSuccess}
                                    onClose={() => this.setState({ message: "" })}
                                />
                            </div>
                        </div>
                        <div className="row row-3">
                            <div className="col col-lg-12 content" style={{ maxHeight: (window.innerHeight - (window.innerHeight*(0.45))), overflow: "auto" }}>   
                                <ImageUploader 
                                    circular 
                                    src={this.state.imageURL} 
                                    size="250x100"
                                    onChange={this.handleInputChange}
                                />
                                <Input 
                                    label="name"
                                    type="text" 
                                    id="name" 
                                    value={this.state.name} 
                                    placeholder="Name"
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput }
                                />
                                <Select 
                                    label="supervisor" 
                                    id="supervisor" 
                                    value={this.state.supervisor}
                                    options={this.state.supervisors} 
                                    onChange={this.handleInputChange} 
                                />
                                <Input 
                                    label="location" 
                                    id="location" 
                                    placeholder="Location"
                                    value={this.state.location} 
                                    onChange={this.handleInputChange} 
                                />
                                <Input 
                                    label="email" 
                                    type="text" 
                                    id="email" 
                                    placeholder="Email"
                                    value={this.state.email} 
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                                <Input 
                                    label="tel no" 
                                    type="text" 
                                    id="tel_no" 
                                    value={this.state.tel_no} 
                                    placeholder="Tel. No."
                                    onChange={this.handleInputChange} 
                                    onClear={this.handleClearInput}
                                />
                            </div>  
                        </div>
                        <div className="row row-3">
                            <div className="col-lg-12 btn-container">
                                <Button 
                                    text="Cancel"
                                    type="button"
                                    className="btn-danger cancel"
                                    onClick={() => {
                                        this.props.onClose();
                                    }}
                                />
                                <Button 
                                    text="Add"
                                    className="btn-success submit"
                                    isSuccess={this.state.isSuccess}
                                    onClick={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    }
}