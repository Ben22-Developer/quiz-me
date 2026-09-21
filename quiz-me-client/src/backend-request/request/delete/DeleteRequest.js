import accessTokenRequiredRequest from "../../axios-global-config/AccessToken";

export async function deleteRequestWithAccessToken(url, payload) {
  
    try {

        return await accessTokenRequiredRequest(url, 
            {
                method: "DELETE",
                withCredentials: true,
                data: payload,
                headers:{}
            });
    } 
    catch (error) {
        throw new Error(error, "");
    }  
}