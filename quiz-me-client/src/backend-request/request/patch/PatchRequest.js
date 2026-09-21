import axios from "axios";
import accessTokenRequiredRequest from "../../axios-global-config/AccessToken";


export async function patchRequestByCookiesIncluded(url, payload) {
  try {

    const response = await axios(url, 
    {
        method: "PATCH",
        withCredentials: true,
        data: payload,
    });

    return response.data;
  } 
  catch (error) {
            throw new Error(error, "");
  }
}

export async function patchRequestWithAccessToken(url, payload) {

    try {

        return await accessTokenRequiredRequest(url, 
            {
                method: "PATCH",
                withCredentials: true,
                data: payload,
                headers:{}
            });
    } 
    catch (error) {
        throw new Error(error, "");
    }
}