import axios from 'axios';
import { getDateTime } from './DateTime';

export const HOST = 'http://localhost:8000';
//export const HOST = 'http://ecandoni.com:8000';

export const RETRIEVE_USER = HOST + "/api/users/";

export const getHost = () => {
    return HOST;
}

export async function fetchData(path) {
    const response = await axios.get(HOST + path)
    return response;
}

export async function patchData(path) {
    const response = await axios.patch(HOST + path)
    return response;
}

export async function postData(path, data) {
    const response = await axios.post(HOST + path, data)
    return response;
}

export function deleteData(from, item) {
    axios.delete(HOST + "/api/"+ from + "/delete/" + item + "/")
    .then(response => {
        alert("Deleted Successfully!");
    }).catch(err => {
        alert("Failed to delete item.")
    })
}

export async function getAllEmployees() {
    const response = await axios.get(HOST + "/api/employees/")
    return await response.data;
}

export async function getAllOffices() {
    const response = await axios.get(HOST + "/api/offices/")
    return await response.data;
}

export async function getAllJobs() {
    const response = await axios.get(HOST + "/api/jobs/")
    return await response.data;
}

export const validateEmail = async(email) => {
    const response = await axios.get(HOST + "/is-new-email-available/" + email + "/")
    return response.status === 200 ? true : false;
}

export function updateJobStatus(position, status) {
    axios.patch(HOST + "/api/positions/update/" + position + "/", {
        is_vacant: status,
    }).then(res => {  
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

export function createJobHistory(data) {
    axios.post(HOST + "/api/job-histories/new/", data).then(res => {  
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

export function createUserAcitivity(user,type, action, description) {
    axios.post(HOST + "/api/user-activities/new/", {
        user: user,
        type: type,
        action: action,
        description: description,
        ip_address: "",
        date: getDateTime()
    }).then(res => {  
    }).catch(err => {
    })
}