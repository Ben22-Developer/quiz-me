using quiz_me_server.code.dto.user;

namespace quiz_me_server.code.repository.contract;

public interface IUserRepository
{
    Task<int> CreateUser (User user);

    Task<int> UpdateClientFieldUser(ClientUserField user);

    Task<int> UpdateUserRefreshTokenExpiryDate(string googleId, DateTime dateTime);
    
    Task<int> UpdateUserRefreshToken(string googleId, string refreshToken, DateTime expiryDatetime);

    Task<User> GetUserByGoogleId(string googleId);
    
    Task<User> GetUserByRefreshToken(string refreshToken);

    Task<ClientUserField> GetUserClientFieldByGoogleId(string googleId);

    Task<int> DeleteUserByGoogleId(string googleId);
}