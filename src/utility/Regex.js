import { getHost } from "./APIService";
import axios from "axios";
import { getAge } from "./DateTime";

export const errMessage = {
    employee_no: "*Please enter a valid employee no.",
    sur_name: "*Surname contains invalid characters.",
    first_name: "*Fist name contains invalid characters.",
    middle_name: "*Middle name contains invalid characters.",
    height: "*Please enter a valid height.",
    weight: "*Please enter a valid weight.",
    email: "*Please enter a valid email",
    username: "*Please enter a valid username",
    password: "*Please enter a valid password",
    birthplace: "*Please enter a valid address",
    birthdate: "*Age must be alteast 18 years old and above",
};

export const isBirthDate = (birthdate) => {
    const age = getAge(birthdate);
   return age < 18 || age > 60 ? false : true;
}

/* eslint-disable */
export const isDecimal = (value) => { 
    return new RegExp("^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$").test(value)
}

export const isInteger = (value) => { 
    return new RegExp("^([0-9]+\.[0-9]+)$").test(value) || new RegExp("^[0-9]+$").test(value)
}
    
export const hasIllegalCharacters = (value) => { 
    return new RegExp("^[a-zA-Z0-9-.' ]+$").test(value) ? false : true
}

export const isEmail = (value) => { 
    return new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$").test(value)
}

export const isValidEmployeeNo = (value) => { 
    if (!value) {
        return true;
    } else {
        return new RegExp('^[0-9]+-[0-9]+$').test(value)
    }
}

export const isHeight = (value) => { 
    if (new RegExp('^[0-9]+$').test(value.split(' ')[0]) && value.split(' ')[1] === "cm") {
        return parseInt(value) >= 120 && parseInt(value) <= 300 ? true : false;
    }
    return false;
}

export const isMiddleName = (value) => { 
    return new RegExp("^[a-zA-Z' ]+$").test(value)
}

export const isName = (value) => { 
    return new RegExp("^[a-zA-Z' ]+$").test(value)
}

export const isLetter = (value) => { 
    return !value? true : new RegExp("^[a-zA-Z' ]+$").test(value)
}

export const isUsernameAndPasswordEquals = (data) => { 
    return data.username === data.password; 
}

export const isUsername = (value) => { 
    return new RegExp("^[a-zA-Z0-9_]{8,20}$").test(value)
}

export const isPassword = (value) => { 
    // Must at least eight characters, one special character and one number
    return new RegExp("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(value)
}

export const isWeight = (value) => { 
    if (new RegExp('^[0-9]+$').test(value.split(' ')[0]) && value.split(' ')[1] === "kg") {
        return parseInt(value) >= 40 && parseInt(value) <= 200 ? true : false;
    }
    return false;
}

export const isEmailTaken = (id, email, data) => {
    try {
        for (const item of data) {
            if (item.id !== id && item.email === email) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}

export const ValidateEmployee = async (data) => {
    const response = await axios.post(getHost() + "/api/employees/validate/", data);
    return response;
}

export const isTelNo = (value) => { 
    return new RegExp("^[0-9]{3}-[0-9]{4}$").test(value)
}

export const isMobileNo = (value) => { 
    return new RegExp("^[0]{1}[9]{1}[0-9]{9}$").test(value)
}

export const isAddress = (value) => {
    return new RegExp("^[a-zA-Z 0-9,.()#-]+$").test(value)
}

export const isValidLeaveDuration = (value) => {
    return value && (value <= 0 || value >= 365) ? false : true;
}
