using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.auth;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.service.auth;
using quiz_me_server.code.service.cookie;
using quiz_me_server.code.service.user;

namespace quiz_me_server.code.controller.auth;

[ApiController]
[Route("/api/server/v1/jwt")]
public class JWTIssuerController : ControllerBase
{
    private readonly JWTIssuerService jwtIssuerService;

    private readonly UserService userService;
    
    public JWTIssuerController (JWTIssuerService jwtIssuerService, UserService userService)
    {
        this.jwtIssuerService = jwtIssuerService;
        this.userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthCode authCode)
    {
        
        await jwtIssuerService.GetJWT(authCode.Code);

        string jwt = jwtIssuerService.JWT;

        User user = jwtIssuerService.User;

        if (await userService.GetUserByGoogleId(user.GoogleId) == null)
        {
            await userService.CreateUser(user);
        }
        else
        {
            await userService.UpdateUserRefreshToken(user.GoogleId, user.RefreshToken, user.RefreshTokenExpiryDate);
        }

        new CookieService().SetRefreshToken(this.Response, jwtIssuerService.User.RefreshToken, user.RefreshTokenExpiryDate);
        
        return Ok(jwt);
    }
}