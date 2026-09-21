using System.Text.Json;
using quiz_me_server.code.constant;
using quiz_me_server.code.controller.auth;
using quiz_me_server.code.dto.auth;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.service.client_request;
using quiz_me_server.code.service.user;

namespace quiz_me_server.code.service.auth;

public class JWTRefreshTokenService
{
    private readonly UserService userService;
    
    private readonly IConfiguration configuration;
    
    public string QuizMeJWT { set; get; }
    
    public string GoogleIdToken { set; get; }
    
    public User User { set; get; }
    
    public User GoogleUser { set; get; }

    public JWTRefreshTokenService(UserService userService, IConfiguration config)
    {
        this.userService = userService;
        this.configuration = config;
    }

    public async Task<object> SetRefreshedJwtTokens (string refreshToken)
    {
        User = await RefreshToken_GoogleIdValidate (refreshToken);
        
        GoogleTokenDTO googleTokenDTO = await GetGoogleTokenDto(refreshToken);

        await SetFields(googleTokenDTO);
        
        return null;
    }
    
    private async Task<object> SetFields (GoogleTokenDTO googleTokenDTO)
    {
        QuizMeTokenService quizMeTokenService = new QuizMeTokenService(configuration, User);

        QuizMeJWT = quizMeTokenService.GetQuizMeJwt();

        GoogleIdToken = googleTokenDTO.id_token;

        GoogleUser = await GetUserByAccessTokenJWT(int.Parse(configuration[QuizMeJWTConstant.AccessTokenLifetimeKey]), googleTokenDTO.access_token, User.RefreshToken);

        return null;
    }
    
    private async Task<GoogleTokenDTO> GetGoogleTokenDto (string refreshToken)
    {
        string responseString = await new ClientRequestService().MakeFormUrlEncodedContentRequest(
            GoogleTokenService.httpClient, configuration[GoogleConfigurationConstant.GoogleAuthCodeExchangeUrlKey],GoogleCredentials (refreshToken), "Token fetching failed."); 
        
        return JsonSerializer.Deserialize<GoogleTokenDTO>(responseString);
    }
    

    private async Task<User> RefreshToken_GoogleIdValidate (string refreshToken)
    {
        User user = await userService.GetUserByRefreshToken(refreshToken);
    
        if (user == null ||
            !user.RefreshToken.Equals(refreshToken) ||
            user.RefreshTokenExpiryDate < DateTime.Now)
        {
            throw new UnauthorizedAccessException();
        }
        return user;
    }
    
    private Dictionary<string, string> GoogleCredentials (string refreshToken)
    {
        Dictionary<string, string> credentials = new Dictionary<string, string> ();
        
        credentials.Add(GoogleConfigurationConstant.GoogleClientIDKey, configuration[GoogleConfigurationConstant.GoogleClientIDValue]);
        credentials.Add(GoogleConfigurationConstant.GoogleGrantTypeKey, configuration[GoogleConfigurationConstant.GoogleRefreshTokenGrantTypeValue]);
        credentials.Add(GoogleConfigurationConstant.GoogleRefreshTokenKey, refreshToken);
        credentials.Add(GoogleConfigurationConstant.GoogleClientSecretKey, configuration[GoogleConfigurationConstant.GoogleClientSecretValue]);
        
        return credentials;
    }
    
    private async Task<User> GetUserByAccessTokenJWT (int refreshTokenLifetime, string accessToken, string refreshToken)
    {
        Dictionary<string, object> claims = 
            await new ClientRequestService().GetUserCredentialsByBearerAccessToken(
                GoogleTokenService.httpClient,
            configuration[GoogleConfigurationConstant.UserinfoByAccessTokenUrlKey],
                accessToken);
        
        return new GoogleTokenService().GetUserByClaims(refreshTokenLifetime, claims, refreshToken);
    }

    public async Task<object> UpdateUserRefreshTokenExpiryToken()
    {
        await userService.UpdateUserRefreshTokenExpiryDate(GoogleUser.GoogleId, GoogleUser.RefreshTokenExpiryDate);
        return null;
    }
    public async Task<object> UpdateClientUserData()
    {
        bool isSame = User.GetClientUserField().IsClientFieldSame(GoogleUser.GetClientUserField());
        
        if (!isSame)
            await userService.DailyUpdateOnUserClientField(GoogleUser.GetClientUserField());

        return null;
    }
}