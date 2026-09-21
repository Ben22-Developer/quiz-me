using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.service.auth;
using quiz_me_server.code.service.cookie;
using quiz_me_server.code.service.user;

namespace quiz_me_server.code.controller.auth;

[ApiController]
[Route("/api/server/v1/jwt")]
public class JWTRefreshTokenController : ControllerBase
{
    
    private readonly JWTRefreshTokenService jwtRefreshTokenService;

    public JWTRefreshTokenController (JWTRefreshTokenService jwtRefreshTokenService)
    {
        this.jwtRefreshTokenService = jwtRefreshTokenService;
    }
    
    [HttpPatch("refresh-token")]
    public async Task<IActionResult> RefreshToken ()
    {
        
        KeyValuePair<string, string> refreshTokenCookie = Request.Cookies
            .FirstOrDefault(x => x.Key==QuizMeJWTConstant.RefreshTokenCookieName);

        Dictionary<string, string> cookies = Request.Cookies
            .Where((x) => x.Key == QuizMeJWTConstant.RefreshTokenCookieName || x.Key == DailyCheckConstant.DailyCheckerCookieKey)
            .ToDictionary();

        if (cookies.GetValueOrDefault(QuizMeJWTConstant.RefreshTokenCookieName) == null)
            return Unauthorized();

        await jwtRefreshTokenService.SetRefreshedJwtTokens(cookies[QuizMeJWTConstant.RefreshTokenCookieName]);

        await jwtRefreshTokenService.UpdateUserRefreshTokenExpiryToken();

        if (cookies.GetValueOrDefault(DailyCheckConstant.DailyCheckerCookieKey) == null)
        {
            await jwtRefreshTokenService.UpdateClientUserData();
            new CookieService().SetDailyCheckCookie(this.Response, DateTime.UtcNow.AddDays(1));
        }

        return Ok(jwtRefreshTokenService.QuizMeJWT);
    }
}
