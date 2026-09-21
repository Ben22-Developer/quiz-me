using quiz_me_server.code.dto.user;
using quiz_me_server.code.repository.contract;

namespace quiz_me_server.code.service.user;

public class UserService
{
    private readonly IUserRepository userRepository;

    public UserService(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public async Task<int> CreateUser(User user) 
    {
        int update = await userRepository.CreateUser(user);

        CheckUpdatedRows(update, 1, $"Only one user should be created. But {update} are created.");

        return update;
    }
    
    
    public async Task<int> DailyUpdateOnUserClientField(ClientUserField clientUserField)
    {
        ClientUserField user = await GetUserClientFieldsByGoogleId(clientUserField.GoogleId);

        if (IsUserClientFieldSame(clientUserField, user))
            return 0;
        
        int updates = await userRepository.UpdateClientFieldUser(clientUserField);
        
        CheckUpdatedRows(updates, 1, $"Expected only one user row detail update but had {updates} updates.");

        return updates;
    }

    private bool IsUserClientFieldSame ( ClientUserField actualClientUserField, ClientUserField dbClientUserField)
    {
        if (!actualClientUserField.GoogleId.Equals(dbClientUserField.GoogleId))
        {
            throw new Exception("user Id mismatch.");
        }
        
        return actualClientUserField.Name.Equals(dbClientUserField.Name) ||
               actualClientUserField.Username.Equals(dbClientUserField.Username) ||
               actualClientUserField.ProfilePictureUrl.Equals(dbClientUserField.ProfilePictureUrl);
    }
    
    public async Task<int>UpdateUserRefreshTokenExpiryDate (string googleId, DateTime expiryDateTime)
    {
        int updates = await userRepository.UpdateUserRefreshTokenExpiryDate (googleId, expiryDateTime);
        
        CheckUpdatedRows(updates, 1, $"Expected only one refresh token update but had {updates} updates.");

        return updates;
    }
    
    public async Task<int>UpdateUserRefreshToken (string googleId, string refreshToken, DateTime expiryDateTime)
    {
        await userRepository.UpdateUserRefreshToken (googleId, refreshToken, expiryDateTime);
        return 0;
    }

    public async Task<User?> GetUserByGoogleId(string googleId)
    {
        return await userRepository.GetUserByGoogleId(googleId);
    }
    
    public async Task<User?> GetUserByRefreshToken(string refreshToken)
    {
        return await userRepository.GetUserByRefreshToken(refreshToken);
    }
    
    public async Task<ClientUserField> GetUserClientFieldsByGoogleId(string googleId)
    {
        return await userRepository.GetUserClientFieldByGoogleId(googleId);
    }

    
    public async Task<int> DeleteUserByGoogleId(string googleId)
    {
        int updates =  await userRepository.DeleteUserByGoogleId(googleId);
        
        CheckUpdatedRows(updates, 1, $"Expected only user to be deleted but had {updates} deletes.");
        
        return updates;
    }

    private void CheckUpdatedRows(int actualUpdatedRows, int expectedUpdatedRows, string errorMessage)
    {
        if (actualUpdatedRows != expectedUpdatedRows)
            throw new Exception(errorMessage);
    }
}