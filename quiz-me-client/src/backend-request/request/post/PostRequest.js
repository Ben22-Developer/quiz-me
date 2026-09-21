import axios from "axios";
import accessTokenRequiredRequest from "../../axios-global-config/AccessToken";

export default async function postRequest(url, payload) {

  try {

    const response = await axios(url, 
    {
      method: "POST",
      data: payload,
      withCredentials: true
    });

    return response.data;
  } 
  catch (error) {
            throw new Error(error, "");
  }
}

export async function postRequestWithAccessToken(url, payload) 
{
  try {

    return await accessTokenRequiredRequest(url, 
    {
      method: "POST",
      data: payload,
      withCredentials: true,
      headers:{},
    });
  } 
  catch (error) 
  {
    throw new Error(error, "");
  }
}