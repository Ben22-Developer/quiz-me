import axios from "axios";

axios.interceptors.request.use((config) => 
{
    return config;    
},
(error) => 
{
    return Promise.reject(new Error(error.status));
});

axios.interceptors.response.use((config) => 
{
    return config;    
},
(error) => 
{
    return Promise.reject(new Error(error.status));
});