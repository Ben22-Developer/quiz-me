using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.JsonWebTokens;
using quiz_me_server.code.constant;
using quiz_me_server.code.controller.auth;
using quiz_me_server.code.dto.auth;
using quiz_me_server.code.dto.user;

namespace quiz_me_server.code.service.auth;

public class JWTIssuerService
{
    private readonly IConfiguration configuration;
    
    public string JWT { private set; get; }
    
    public string RefreshToken { private set; get; }
    
    public User User { private set; get; }

    public JWTIssuerService (IConfiguration configuration)
    {
        this.configuration = configuration;
    }


    public async Task<object> GetJWT(string code)
    {
        GoogleTokenDTO googleTokenDTO = await GetGoogleTokenDTO (code);
        
        SetFields(googleTokenDTO);

        return null;
    }
    
    private async Task<GoogleTokenDTO> GetGoogleTokenDTO (string code)
    {
        GoogleTokenService googleTokenService = new GoogleTokenService
        {
            GoogleAuthCodeExchangeUrl = configuration[GoogleConfigurationConstant.GoogleAuthCodeExchangeUrlKey],
            GoogleClientIdValue = configuration[GoogleConfigurationConstant.GoogleClientIDValue],
            GoogleClientSecretValue = configuration[GoogleConfigurationConstant.GoogleClientSecretValue],
            GoogleRedirectUriValue = configuration[GoogleConfigurationConstant.GoogleRedirectUriValue],
            GoogleGrantTypeValue = configuration[GoogleConfigurationConstant.GoogleAuthCodeGrantTypeKey]
        };
        
        return await googleTokenService.GetGoogleTokenDto(code);
    }

    private User GetUserByIdTokenJWT (string idToken, string refreshToken)
    {
        JsonWebTokenHandler jsonWebTokenHandler = new JsonWebTokenHandler();

        JsonWebToken jsonWebToken = jsonWebTokenHandler.ReadJsonWebToken(idToken);

        Dictionary<string, string> claims = jsonWebToken.Claims.Select(x => new KeyValuePair<string,string>(x.Type, x.Value)).ToDictionary();
        
        if (!bool.Parse(claims["email_verified"]))
            throw new Exception("Unverified email!");

        return new User
        {
            GoogleId = claims["sub"],
            Username = claims["email"],
            Name = claims["name"],
            ProfilePictureUrl = claims["picture"],
            RefreshToken = refreshToken,
            RefreshTokenExpiryDate = DateTime.Now.AddDays(int.Parse(configuration[QuizMeJWTConstant.RefreshTokenLifetimeKey]))
        };
    }


    private void SetFields (GoogleTokenDTO googleTokenDto)
    {
        User = GetUserByIdTokenJWT(int.Parse(configuration[QuizMeJWTConstant.RefreshTokenLifetimeKey]), googleTokenDto.id_token, googleTokenDto.refresh_token);
        
        QuizMeTokenService quizMeTokenService = new QuizMeTokenService(configuration, User);
        
        JWT = quizMeTokenService.GetQuizMeJwt();
        
        RefreshToken = googleTokenDto.refresh_token;
    }
    
    private User GetUserByIdTokenJWT (int refreshTokenLifetime, string idToken, string refreshToken)
    {
        return new GoogleTokenService().GetUserByGoogleIdTokenJWT(refreshTokenLifetime, idToken, refreshToken);
    } 
}