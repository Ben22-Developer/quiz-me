using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.service.auth;
using quiz_me_server.code.service.cookie;
using quiz_me_server.code.service.user;

namespace quiz_me_server.code.controller.user;

[ApiController]
[Route("/api/server/v1/user")]
public class UserController : ControllerBase
{
    private readonly UserService userService;

    public UserController(UserService userService)
    {
        
        this.userService = userService;
    }
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout ()
    {
        string refreshToken = Request.Cookies[QuizMeJWTConstant.RefreshTokenCookieName];

        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new Exception("Null refresh token!");
        }

        await userService.UpdateUserRefreshTokenExpiryDate(new UserInContextService(this.User).GoogleId(), DateTime.UtcNow);
        
        new CookieService().SetRefreshToken(this.Response, refreshToken, DateTime.UtcNow);
        
        return Ok();
    }

    [HttpGet("user-login-session")]
    public bool UserHasLoginSession()
    {
        return Request.Cookies[QuizMeJWTConstant.RefreshTokenCookieName] != null;
    }
    
    [HttpGet("user-client-data")]
    [Authorize]
    public async Task<IActionResult> GetClientUserData ()
    {
         Claim userGoogleIdClaim = User.Claims.First(x => x.Type.Equals(QuizMeJWTConstant.UserGoogleIdKey));
        
        return Ok(await userService.GetUserClientFieldsByGoogleId(userGoogleIdClaim.Value));
    }
    
    [HttpPatch("user-profile-daily-check")]
    [Authorize]
    public async Task<IActionResult> UpdateClientUserData ()
    {
        string? cookieValue = this.Request.Cookies[DailyCheckConstant.DailyCheckerCookieKey];

        if (cookieValue == null)
        {
            await userService.DailyUpdateOnUserClientField(new UserInContextService(this.User).ClientUserField());
            new CookieService().SetDailyCheckCookie(this.Response, DateTime.UtcNow.AddDays(1));
        }
        return Ok();
    }
    
    [HttpDelete("user-delete")]
    [Authorize]
    public async Task<IActionResult> DeleteUser ()
    {
        
        Claim userGoogleIdClaim = User.Claims.First(x => x.Type.Equals(QuizMeJWTConstant.UserGoogleIdKey));

        string? refreshToken = Request.Cookies[QuizMeJWTConstant.RefreshTokenCookieName];
        
        if (refreshToken == null)
        {
            throw new Exception("Missing refreshToken cookie!");
        }
        
        int deleted = await userService.DeleteUserByGoogleId(userGoogleIdClaim.Value);

        if (deleted != 1)
        {
            throw new Exception($"Deleted user is expected to be 1 but it's {deleted}");
        }
        
        new CookieService().SetRefreshToken(this.Response, refreshToken, DateTime.UtcNow);
        
        return Ok("User deleted successfully!");
    }
}