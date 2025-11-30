import axios from "axios";
const APP_URL = "http://localhost:8080/api/auth";


export const register = (data : any) => axios.post(APP_URL + "/register", data);
export const login = (data : any) => axios.post(APP_URL + "/login", data);

export const password = (data : any) => axios.post(APP_URL + "/forgot-password", data);

