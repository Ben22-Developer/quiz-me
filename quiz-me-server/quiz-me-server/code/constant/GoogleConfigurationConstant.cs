namespace quiz_me_server.code.constant;

public class GoogleConfigurationConstant
{
    private static readonly string  GoogleBaseField = "Google"; 
    
    public static readonly string  GoogleClientIDKey = "client_id"; 
    
    public static readonly string  GoogleClientIDValue = $"{GoogleBaseField}:{GoogleClientIDKey}"; 
    
    public static readonly string  GoogleClientSecretKey = "client_secret"; 
    
    public static readonly string  GoogleClientSecretValue = $"{GoogleBaseField}:{GoogleClientSecretKey}"; 
    
    public static readonly string  GoogleGrantTypeKey = "grant_type"; 
    
    public static readonly string  GoogleAuthCodeGrantTypeKey = $"{GoogleBaseField}:auth_code_grant_type"; 
    
    public static readonly string  GoogleRefreshTokenKey = "refresh_token"; 
    
    public static readonly string  GoogleRefreshTokenGrantTypeValue = $"{GoogleBaseField}:refresh_token_grant_type"; 
    
    public static readonly string  GoogleRedirectUriKey = "redirect_uri"; 
    
    public static readonly string  GoogleRedirectUriValue = $"{GoogleBaseField}:{GoogleRedirectUriKey}"; 
    
    public static readonly string  GoogleCodeKey = "code";
        
    public static readonly string  GoogleAuthCodeExchangeUrlKey = $"{GoogleBaseField}:auth_code_exchange_uri";

    public static readonly string UserinfoByAccessTokenUrlKey = $"{GoogleBaseField}:userinfo_by_access_token_url";
}