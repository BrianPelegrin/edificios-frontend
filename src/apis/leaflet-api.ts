import axios from "axios";

const leafletApi = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org',
    params:{
        'format':'json'
    }
})

export default leafletApi