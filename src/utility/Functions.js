import React from 'react';
import { decrypt, encrypt } from './Encryption';
import { isLetter } from './Regex';
import { getSessionID } from './Session';

export function getLocation(location) {
    const { blk_lot_no, street, subd_village, barangay, city, country } = location;
    return blk_lot_no + (street && ", " + street) + (subd_village && ", " + subd_village ) + (barangay && ", " + barangay.name) + (city && ", " + city.name) + (country && ", " + country.name)
}

export function getName (id, object) {
    try {

        const first_name = getData(id, "first_name", object);
        const sur_name =  getData(id, "sur_name", object); 
        return  first_name + " " + sur_name;

    } catch (error) {
        console.log(error);        
    }
}

export function getEmployeeStatus (status) {
    
    let className = "text-secondary";
    
    const statuses = [
        { status: 'Active', className: 'text-success' }, 
        { status: 'Inactive', className: 'text-danger' }, 
        { status: 'Terminated', className: 'text-warning' }, 
        { status: 'Resigned', className: 'text-danger' }, 
    ];

    for (const item of statuses) {
        if (item.status === status) {
           return <span className={item.className}>{status}</span>
        }
    }

    return <span className={className}>{status}</span>
}

export function setUserID (id) {
    localStorage.setItem('userID', id)
}


export function setModule (module) {
    localStorage.setItem('module', has(module, ' Manager') ? remove(module, ' Manager') : module);
}

export function getModule () {
    const module = localStorage.getItem('module');
    return has(module, ' Manager') ?  remove(module, ' Manager') : module;
}

export function setTableName (tableName) {
    localStorage.setItem('tableName', tableName);
}

export function setDashboardName (name) {
    localStorage.setItem('dashboardName', name)
}

export function getDashboardName () {
    return localStorage.getItem('dashboardName');
}

export function getData (id, column, object) {

    try {
        for (const item of object) {
            if (item.id === id) {
                return item[column];
            }  
        }  
    } catch (error) {
        return "";
    }
}

export function getLeaveBalanceData (employee, leaveType, object, data) {
    for (const item of object) {
        if (item.employee === parseInt(employee) && item.leave_type === parseInt(leaveType)) {
            return item[data];
        }  
    }
    return 0;
}

export function getApprovalStatus(status) {
    return status === 0 ? <span className="text-secondary">Pending</span> :  
           status === 1 ? <span className="text-success">Approved</span> : <span className="text-danger">Declined</span>
}
export function setDashboardID (role) {
    let { title } = role;
    title = title.search(' Manager') > -1 ? title.replace(' Manager', '') : title;
    localStorage.setItem('dashboardID', "can_access_" + spaceToUnderscore(title)+"_dashboard_module".toLowerCase())
}

export function getValue(value) {
    return value && value !== 'undefined' && value && value !== undefined ? value  : 'None';
}

export function getDashboardID () {
    return localStorage.getItem('dashboardID');
}

export function setDashboardPathname (role, session_id) {
    localStorage.setItem("dashboardPathname", encrypt("/pages/" + role.title.toLowerCase().replace(" manager", "") + " dashboard/" + session_id))
}

export function getDashboardPathname () {
    return decrypt(localStorage.getItem("dashboardPathname"));
}

export function getAttendanceStatus (status) {
    try {
        status = parseInt(status);

        if (status === 1) {
            return "Present";
        } else if (status === 2) {
            return "Late";
        } else if (status === 4) {
            return "Absent"
        } else if (status === 5) {
            return "Undertime"
        }

    } catch (error) {
        console.log(error);
    }
}

export function getActiveStatus (status) {

    status = parseInt(status);

    if (status) {
        return <span className="text-success">Active</span>
    } else {
        return <span className="text-danger">Inactive</span>;
    }

}

export function isModuleName (str) {
    return localStorage.getItem('module') === str ? true : false;
}

export function isTable (table) {
    return window.location.pathname.search(table) > -1 ? true: false
}

export function isTableName (str) {
    return localStorage.getItem('TABLE_NAME') === str ? true : false;
}

export function isType (value, type) {
    return typeof value === type ? true : false;
}

export function isPath (path) {
    while(path.search(" ") > -1){
        path = path.replace(" ", "%20");
    }
    return window.location.pathname === path + getSessionID() ? true : false;
}

 
export function show (item_id) {
    let items = item_id.split(',');
    for(let i = 0; i < items.length; i++){
        let item = document.getElementById(items[i]);
        item.style.display = 'block';
    }
}  

export function clean (str) { 
    try {
        for (const key in str) {
            if (!isLetter(str[key])) {
               str = str.replace(str[key], ' ');
            }
        }
    } catch (error) {

    }
    return str;
}

export function hasError(object) {

    try {
        for(const item in object) {
            if (object[item]) {
                return true;
            }
        }
    } catch (error) {
        console.log(error);
        return false;       
    }
    return false;
}

export function hasChanges(object) {

    try {
        for(const item in object) {
            if (object[item]) {
                return true;
            }
        }
    } catch (error) {
        console.log(error);
        return false;       
    }
    return false;
}

export function removeLastChar (str) {
    try {
        let length = str.length;
        let lastChar = str.substr(length-1, length);
        return str.replace(lastChar, '');
    } catch (error) {
        return str;        
    }
}

export function spaceToUnderscore (str) {

    while(str.search(" ") > -1){
        str = str.replace(" ", "_");
    }

    return str;
}

export function spaceToDash (str) {
    try{
        return str.replace(' ','-').toLowerCase()
    }catch(e){
        return str;
    }
}

export function remove (str, toRemove) {
    try {
        while (str.search(toRemove) > -1) {
            str = str.replace(toRemove, '');
        }
        return str;
    } catch (error) {
        return str;
    }
}

export function has (str, toSearch) {
    const arr = toSearch.split(',');
    try {
        for (const item of arr) {
            if (str.search(item) > -1) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}

export function getStr (str) {
    return str ? str : '---';
}

export function FullName (obj) {
    
    let { first_name, middle_name, sur_name, name_extension } = obj;  

    if (middle_name) {
        middle_name = middle_name.substr(0, 1) + ".";
    }

    if (!middle_name && !name_extension) {
        return first_name + " " + sur_name;
    } 

    if (!middle_name) {
        return first_name + " " + sur_name + ", " + name_extension;
    }

    if (!name_extension) {
        return first_name + " " + middle_name + " " + sur_name;
    }

    return first_name + " " + middle_name + " " + sur_name + ", " + name_extension;
}

export function Name (data) {
    return !data || data.length === 0 ? null : data.first_name + " " + data.sur_name
}

export function hasItem (item, permissions) {
    try {
        for (const key of permissions) {
            const code_name = key.permission.code_name;
            if (code_name === item) {
                return true;
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function pathContains (path) {

    const { pathname } = window.location;

    while(path.search(" ") > -1){
        path = path.replace(" ", "%20");
    }

    return pathname.search(path) > -1 ? true : false;
}

export function toCapitalized (str) {
    const data = str.split(' ');
    str = '';

    for (let value of data) { 
        //eslint-disable-next-line
        value = has(value, '_')? value.replace(/\_/, ' ') : value;
        str += value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase()  + " ";    
    }
    
    return str.substr(0, str.length - 1)
}
