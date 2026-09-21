import axios from "axios";
import accessTokenRequiredRequest from "../../axios-global-config/AccessToken";
export default async function getRequest (url) 
{
    try 
    {
        const response = await axios.get(url);

        return response.data;
    } 
    catch (error) {
        throw new Error(error, "");
    }
}

export async function getRequestByCookiesIncluded (url) 
{
    try 
    {
        const response = await axios(url, {
            method: "GET",
            withCredentials: true
        });

        return response.data;
    } 
    catch (error) {
        throw new Error(error, "");
    }
}


export async function getRequestWithAccessToken (url) 
{
    try {

        return await accessTokenRequiredRequest(url, 
            {
                withCredentials: true,
                headers:{}
            });
    } 
    catch (error) {
        throw new Error(error, "");
    }
}