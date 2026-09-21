using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using quiz_me_server.code.constant;
using quiz_me_server.code.dto.auth;
using quiz_me_server.code.dto.user;

namespace quiz_me_server.code.service.auth;

public class QuizMeTokenService
{
    public User User { set; get; }
    public string IssueSigningKey  { set; get; }
    public string Audience { set; get; }
    public string Issuer { set; get; }
    public int AccessTokenLifetimeInMinutes { set; get; }

    public QuizMeTokenService(IConfiguration configuration, User user)
    {
        User = user;
        IssueSigningKey = configuration[QuizMeJWTConstant.IssuerSigningKey];
        Audience = configuration[QuizMeJWTConstant.AudienceKey];
        Issuer = configuration[QuizMeJWTConstant.IssuerKey];
        AccessTokenLifetimeInMinutes = int.Parse(configuration[QuizMeJWTConstant.AccessTokenLifetimeKey]);
    }
    
    
    public string GetQuizMeJwt()
    {
        Claim[] claims = GetClaims();

        SigningCredentials signingCredentials = GetSigningCredentials(GetSymmetricSecurityKey());

        return GetToken(claims, signingCredentials);
    }

    private Claim[] GetClaims ()
    {
        
        Claim[] claims =
        {
            new Claim(QuizMeJWTConstant.UserGoogleIdKey, User.GoogleId),
            
            new Claim(ClaimTypes.Name, User.Name),
            
            new Claim(ClaimTypes.Email, User.Username),
            
            new Claim (QuizMeJWTConstant.ProfilePictureUrlKey, User.ProfilePictureUrl)
        };

        return claims;
    }

    private SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(IssueSigningKey));
    }
    
    private SigningCredentials GetSigningCredentials (SymmetricSecurityKey symmetricSecurityKey )
    {
        return new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
    }

    private string GetToken (Claim[] claims, SigningCredentials signingCredentials)
    {
        JwtSecurityToken jwtSecurityToken = new JwtSecurityToken
            (
                audience: Audience,
                issuer: Issuer,
                claims: claims,
                signingCredentials: signingCredentials,
                // expires: DateTime.Now.AddMinutes(AccessTokenLifetimeInMinutes)
                expires: DateTime.UtcNow.AddMinutes(30)
            );

        return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
    }
}