using quiz_me_server.code.constant;

namespace quiz_me_server.code.service.cookie;

public class CookieService
{
    public void SetRefreshToken (HttpResponse response, string refreshToken, DateTime expiryDatetime)
    {
        CookieOptions cookieOptions = new CookieOptions();

        cookieOptions.Expires = expiryDatetime;
        cookieOptions.HttpOnly = true;
        
        response.Cookies.Append(QuizMeJWTConstant.RefreshTokenCookieName, refreshToken, cookieOptions);
    }
    
    public void SetDailyCheckCookie (HttpResponse response, DateTime expiryDatetime)
    {
        CookieOptions cookieOptions = new CookieOptions();

        cookieOptions.Expires = expiryDatetime;
        cookieOptions.HttpOnly = true;
        
        response.Cookies.Append(DailyCheckConstant.DailyCheckerCookieKey, "true", cookieOptions);
    }    
}