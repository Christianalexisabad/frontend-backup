var CryptoJS = require("crypto-js");

const SECRET_KEY = "MIIC9TCCAd0CAQAwgZMxCzAJBgNVBAYTAlBIMRowGAYDVQQIDBFOZWdyb3MgT2Nj"

export function encrypt(data){
    return CryptoJS.AES.encrypt(data, SECRET_KEY);
}

export function decrypt(data){
    return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
