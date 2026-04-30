import axios from 'axios'

// Axios instance preconfigured for frontend with credentials
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export default instance
