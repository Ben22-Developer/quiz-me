using System.Security.Claims;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.user;

namespace quiz_me_server.code.service.auth;

public class UserInContextService
{
    private readonly Dictionary<string, string> claimsDictionary;

    public UserInContextService(ClaimsPrincipal claimsPrincipal)
    {
        this.claimsDictionary = claimsPrincipal.Claims.Select(x => new KeyValuePair<string, string>(x.Type, x.Value)).ToDictionary();;
    }

    public ClientUserField ClientUserField()
    {
        return new ClientUserField
        {
            GoogleId = claimsDictionary[QuizMeJWTConstant.UserGoogleIdKey],
            ProfilePictureUrl = claimsDictionary[QuizMeJWTConstant.ProfilePictureUrlKey],
            Name = claimsDictionary[ClaimTypes.Name],
            Username = claimsDictionary[ClaimTypes.Email]
        };
    }
    
    public string GoogleId()
    {
        return claimsDictionary[QuizMeJWTConstant.UserGoogleIdKey];
    }
}