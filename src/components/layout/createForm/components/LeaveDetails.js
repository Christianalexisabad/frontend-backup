import Input from "../../../forms/input/Input";
import React, {useState, useEffect} from "react";

export default function LeaveDetails (props) {

    const {
        leaveType,
        otherDetails,
        otherDetailsOption
    } = props.data.state;

    const handleChange = props.onChange;

    const [radio1, setRadio1] = useState(false);
    const [radio2, setRadio2] = useState(false);


    useEffect(() => {
        if(!otherDetailsOption){
            setRadio1(false);
            setRadio2(false);
        }
    })

    function renderOptions (e) {
        const data =[
            { id: 1, options: ["In Hospital", "Out Patient"]},
            { id: 3, options: ["Within the Philippines", "Abroad(specify)"]},
            { id: 9, options: ["Within the Philippines", "Abroad(specify)"]},
            { id: 11, options: ["Completion of Mater's Degree", "BAR/Board Examination Review"]},
            { id: 17, options: ["Monetization of Leave Credits", "Terminal Leave"]},
        ]
        return <div className="col col-lg-12">
                {data.map((item)=>{
                    return <div className="input-group" style={{ 
                            width: "100%",
                            display: parseInt(leaveType) === item.id ? 'inline-block': 'none', 
                            textAlign: 'right',
                            paddingRight: "30px"
                        }}>
                        <input 
                            id="otherDetailsOption"
                            type="radio" 
                            checked={radio1} 
                            value={item.options[0]}
                            onChange={(e) => {
                            setRadio1(true);
                            setRadio2(false);
                            handleChange(e);
                        }}/>
                        <label style={{ fontSize: '14px', margin:"0 10px 0 5px"}} >{item.options[0]}</label>
                        <input 
                            id="otherDetailsOption"
                            type="radio" 
                            value={item.options[1]}
                            checked={radio2} 
                            onChange={(e) => {
                            setRadio1(false);
                            setRadio2(true);
                            handleChange(e);
                        }}/>
                        <label style={{ fontSize: '14px', margin:"0 5px 0 5px"}} >{item.options[1]}</label>
                    </div>
                })}           
            </div>
    }

    return <div className="LeaveDetails">   
        {renderOptions()}
        <span>
            <Input label="Other details" id="otherDetails" value={otherDetails} onChange={handleChange}/>
        </span>
    </div>
}