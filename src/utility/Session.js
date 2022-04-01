import { getHost } from "../utility/APIService";
import axios from "axios";
import { decrypt, encrypt } from "./Encryption";

const HOST = getHost() + "/api/";

export const login = async (username, password) => {
    
    const response = await axios.post(HOST + "sessions/login/", {
        username: username,
        password: password
    })
    
    return await response.data;
}

export const fetchUserInfo = async(session_id) => {
    const response = await axios.get(HOST + "sessions/get/" + session_id + "/")
    return await response.data;
}

export const getUserInfo = async() => {
    const response = await axios.get(HOST + "users/get/username=" + getUsername() + "/")
    return await response.data;
}

export function logout() {
    axios.delete(HOST + "sessions/logout/"+ getSessionID() +"/")
    .then(res => {
        logoutUser(getUsername());
        updateLoginHistory();
        localStorage.clear();
        window.location.href = "/";
    })
    .catch(err => {
        alert(err.response.data.message)
    })
}

export const logoutUser = (username) => {
    axios.patch(HOST + "users/logout/" + username + "/")
}

export const loginUser = (username) => {
    axios.patch(HOST + "users/login/" + username + "/")
}

export function getSessionID() {
    return decrypt(localStorage.getItem("sessionID"));
}

export function getUsername() {
    return decrypt(localStorage.getItem("username"));
}

export function getUserID() {
    return parseInt(decrypt(localStorage.getItem("userID")));
}

export function getEmployeeID() {
    const ID = localStorage.getItem("employeeID");
    return parseInt(decrypt(ID ? ID : ""));
}

export function getUserType() {
    return parseInt(decrypt(localStorage.getItem("userType")));
}

export function getPosition() {
    return decrypt(localStorage.getItem("position"));
}

export function getRole() {
    return parseInt(decrypt(localStorage.getItem("role")));
}

export function getEpiry() {
    return decrypt(localStorage.getItem("expiry"));
}

export function setImageURL(imageURL) {
    localStorage.getItem("imageURL", encrypt(imageURL));
}

export function getImageURL() {
    return decrypt(localStorage.getItem("imageURL"));
}

export function getName() {
    return decrypt(localStorage.getItem("firstName")) + " " + decrypt(localStorage.getItem("surName"));
}

export function setSurname(surname) {
    localStorage.getItem("surName", encrypt(surname));
}

export function getSurname() {
    return decrypt(localStorage.getItem("surName"));
}

export function setFirstName(first_name) {
    localStorage.getItem("firstName", encrypt(first_name));
}

export function getFirstName() {
    return decrypt(localStorage.getItem("firstName"));
}

export function setEmail(email) {
    localStorage.getItem("email", encrypt(email));
}

export function getEmail() {
    return decrypt(localStorage.getItem("email"));
}

export const createLoginHistory = (username) => {
    axios.post(getHost() + "/api/login-histories/new/", {
        username: username   
    }).then(response => {
        localStorage.setItem("loginID",response.data.id)
    })
}

export const updateLoginHistory = () => {
    const loginID = localStorage.getItem("loginID");
    axios.patch(getHost() + "/api/login-histories/update/" +loginID +"/")
}

