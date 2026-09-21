namespace quiz_me_server.code.constant;

public class QuizMeJWTConstant
{
    private static readonly string QuizMeJWTBase = "QuizMeJWT";
    
    public static readonly string AudienceKey = $"{QuizMeJWTBase}:aud";
 
    public static readonly string IssuerKey = $"{QuizMeJWTBase}:iss";

    public static readonly string AccessTokenLifetimeKey = $"{QuizMeJWTBase}:access_token_lifetime";
    
    public static readonly string RefreshTokenLifetimeKey = $"{QuizMeJWTBase}:refresh_token_lifetime";
        
    public static readonly string IssuerSigningKey=  $"{QuizMeJWTBase}:iss_signing_key";
    
    public static readonly string ProfilePictureUrlKey =  "picture";
    
    public static readonly string UserGoogleIdKey =  "id";

    public static readonly string RefreshTokenCookieName = "quiz-me-refresh-token";
}