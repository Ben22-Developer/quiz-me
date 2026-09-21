import axios from "axios";
import { RefreshTokenServerApiV1 } from "../api/ServerApi";
import { unauthenticatedExceptionCode } from "../../component/error/SpecialErrorCode";

let accessToken = "";

const accessTokenFetchRetries = 1;

function setAccessToken (token)
{
    accessToken = token;
}

async function fetchAccessToken () 
{

    try 
    {
        const response = await axios(RefreshTokenServerApiV1,
            {
                method: "PATCH",
                withCredentials: true,
            }
        )

        setAccessToken(response.data);
    } 
    catch (error) {
        throw new Error(error, error);
    }    
}

export default async function accessTokenRequiredRequest (url, payload)
{
  let accessTokenFreshRetriesDone = 0;
  let isFetchingAccessToken = false;

  payload.headers["Authorization"] = `Bearer ${accessToken}`;

  while (true)
  {
    try {

      if (isFetchingAccessToken) 
      {
          await fetchAccessToken();
          isFetchingAccessToken = false;
          payload.headers["Authorization"] = `Bearer ${accessToken}`;
          continue;
      }

      const response = await axios(url, payload);

      return response.data;
    } 
    catch (error) 
    {

      if (error.message.includes(unauthenticatedExceptionCode) &&
          accessTokenFreshRetriesDone < accessTokenFetchRetries
      ) 
      {
          isFetchingAccessToken = true;
          accessTokenFreshRetriesDone += 1;
          continue;
      }
      else
          throw new Error(error, error);
    }
  }
}