import axios from 'axios';
import Toasts from './Components/Classes/Toasts'

let api = axios.create({
  baseURL: `http://localhost:8080/`
});

api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  let message = ""
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    message = error.response.data.message
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    message = "No response received from backend server!"
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message
  }
  Toasts.error(message);

  return Promise.reject(error)
});

export default api;