using System.Buffers;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Microsoft.IdentityModel.JsonWebTokens;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.auth;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.service.client_request;

namespace quiz_me_server.code.service.auth;

public class GoogleTokenService
{
    public static readonly HttpClient httpClient = new HttpClient();
    public string GoogleAuthCodeExchangeUrl { set; get;  }
    
    public string GoogleClientIdValue { set; get;  }
    
    public string GoogleClientSecretValue { set; get;  }
    
    public string GoogleGrantTypeValue { set; get;  }
    
    public string GoogleRedirectUriValue { set; get;  }
    
    public async Task<GoogleTokenDTO> GetGoogleTokenDto(string code)
    {
        string responseString = await new ClientRequestService().MakeFormUrlEncodedContentRequest(httpClient, GoogleAuthCodeExchangeUrl, GoogleCredentials (code), "Token fetching failed."); 
        
        return JsonSerializer.Deserialize<GoogleTokenDTO>(responseString);
    }
    
    private Dictionary<string, string> GoogleCredentials (string code)
    {
        Dictionary<string, string> credentials = new Dictionary<string, string> ();
        
        credentials.Add(GoogleConfigurationConstant.GoogleClientIDKey, GoogleClientIdValue);
        credentials.Add(GoogleConfigurationConstant.GoogleClientSecretKey, GoogleClientSecretValue);
        credentials.Add(GoogleConfigurationConstant.GoogleCodeKey, code);
        credentials.Add(GoogleConfigurationConstant.GoogleGrantTypeKey, GoogleGrantTypeValue);
        credentials.Add(GoogleConfigurationConstant.GoogleRedirectUriKey, GoogleRedirectUriValue);
        
        return credentials;
    }
    
    public static void InstatiateHttpClient()
    {
        httpClient.BaseAddress = new Uri("https://oauth2.googleapis.com/token");
    }

    public User GetUserByGoogleIdTokenJWT(int refreshTokenLifetime, string idToken, string refreshToken)
    {
        JsonWebTokenHandler jsonWebTokenHandler = new JsonWebTokenHandler();

        JsonWebToken jsonWebToken = jsonWebTokenHandler.ReadJsonWebToken(idToken);

        Dictionary<string, object> claims = jsonWebToken.Claims
            .Select(x => new KeyValuePair<string, object>(x.Type, x.Value)).ToDictionary();

        return GetUserByClaims(refreshTokenLifetime, claims, refreshToken);
    }

    public User GetUserByClaims (int refreshTokenLifetime, Dictionary<string, object> claims, string refreshToken)
    {
        
        if (!bool.Parse(claims["email_verified"].ToString()))
            throw new Exception("Unverified email!");
        
        return new User
        {
            GoogleId = claims["sub"].ToString(),
            Username = claims["email"].ToString(),
            Name = claims["name"].ToString(),
            ProfilePictureUrl = claims["picture"].ToString(),
            RefreshToken = refreshToken,
            RefreshTokenExpiryDate = DateTime.UtcNow.AddDays(refreshTokenLifetime)
        };
    }
}