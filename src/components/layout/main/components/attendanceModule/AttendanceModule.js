import React from 'react';
import { isPath } from '../../../../../utility/Functions';
import MyAttendance from './components/myAttendance/MyAttendance';

function AttendanceModule() {

    const display = isPath("/pages/attendance/")

    return ( 
        display &&
        <div className="AttendanceModule">
            <div className="row">
                <div className="col-lg-12">
                    <MyAttendance />
                </div>
            </div>
        </div>
    );
}

export default AttendanceModule;