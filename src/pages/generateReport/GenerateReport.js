import './GenerateReport.css';
import React from "react";
import SubmitButton from '../../components/forms/submitButton/SubmitButton';
import { getCurrentDate } from '../../utility/DateTime';
import CancelButton from '../../components/forms/cancelButton/CancelButton';
import { PDFExport } from '@progress/kendo-react-pdf';

const GenerateReport = (props) => {

    
    const data = props.data;

    const handleSubmit = () => {
        data.current.save();
    }

    function renderEmployeeList() {

        const header = [
            { id: "id", name: "no"},
            { id: "employee_type", name: "employee type"},
            { id: "employee_no", name: "employee no"},
            { id: "name", name: "name"},
            { id: "position", name: "position"},
            { id: "department", name: "department"},
            { id: "sex", name: "sex"},
            { id: "date_hired", name: "date hired"},
        ];

        return (
            <table className="table table">
                <thead>
                    <tr>
                        {header.map((item, index) => {
                            return (
                                <th key={index}>
                                    <span>{item.name}</span>
                                </th>
                            ) 
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((item, i) => {
                        return (
                            <tr key={i}>
                                <td>{i+=1}</td>
                                <td>{item.employee_type}</td>
                                <td>{item.employee_no}</td>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.department}</td>
                                <td>{item.sex}</td>
                                <td>{item.date_hired}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div className="GenerateReport">
            <form action="" onSubmit={handleSubmit}>
                <div className="container">
                    <PDFExport  ref={data}  paperSize="A4">
                        <div className="toPrint p-3">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h1 className="title">{props.title}</h1>
                                    <h2 className="sub-title">Total: <b>{data.length}</b></h2>
                                    <h2 className="sub-title">From: <b>{props.from} - {props.to}</b></h2>
                                    <h2 className="sub-title">Date of Report: <b>{getCurrentDate()}</b></h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    {renderEmployeeList()}
                                </div>
                            </div>
                        </div>
                    </PDFExport>
                    <div className="row">
                        <div className="col-lg-12 text-end">
                            <CancelButton text="Cancel" onClick={()=> props.onClose()} />
                            <SubmitButton text="Download" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )

}

export default GenerateReport;