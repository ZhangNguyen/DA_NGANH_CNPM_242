import axios from "./axios"

export const apiGetHistory = () => axios({
    url: "/api/history",
    method: "GET"
})