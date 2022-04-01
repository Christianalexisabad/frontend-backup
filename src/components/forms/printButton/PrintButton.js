import React from "react";
import "./PrintButton.css";
import SubmitButton from "../submitButton/SubmitButton";

const PrintButton = (props) => {

    let { table, title, header, data, from, to, employeeID } = props;

    return (
        <SubmitButton
            type="button"
            icon="fa fa-print"
            text="Print"
            onClick={()=> {
                
                localStorage.setItem("toPrint", JSON.stringify({
                    employeeID: employeeID,
                    table: table,
                    title: title,
                    from: from,
                    to: to,
                    header: header,
                    data: data
                }))

                window.open("/pages/print/")
            }}
        />
    )
}

export default PrintButton;