import axios from "axios";

const buildingsApi = axios.create({
     baseURL:'http://localhost:5153'
})

export default buildingsApi