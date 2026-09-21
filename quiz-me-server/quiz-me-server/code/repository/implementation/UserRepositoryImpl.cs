using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using quiz_me_server.code.database;
using quiz_me_server.code.dto.user;
using quiz_me_server.code.repository.contract;

namespace quiz_me_server.code.repository.implementation;

public class UserRepositoryImpl : IUserRepository
{
    private readonly QuizMeDatabaseContext dbContext;

    public UserRepositoryImpl(QuizMeDatabaseContext dbContext) {
        this.dbContext = dbContext;
    }

    public async Task<int> CreateUser(User user)
    {
        await dbContext.User.AddAsync(user);
        return await dbContext.SaveChangesAsync();
    }

    public async Task<int> UpdateClientFieldUser (ClientUserField user)
    {
        return await dbContext.User
            .Where(x => x.GoogleId.Equals(user.GoogleId))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.Username, user.Username)
                .SetProperty(x => x.Name, user.Name)
                .SetProperty(x => x.ProfilePictureUrl, user.ProfilePictureUrl));
    }
    
    public async Task<int> UpdateUserRefreshTokenExpiryDate(string googleId, DateTime expiryDateTime)
    {
        return await dbContext.User
            .Where(x => x.GoogleId.Equals(googleId))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.RefreshTokenExpiryDate, expiryDateTime));
    }

    public async Task<int> UpdateUserRefreshToken(string googleId, string refreshToken, DateTime expiryDatetime)
    {
        return await dbContext.User
            .Where(x => x.GoogleId.Equals(googleId))
            .ExecuteUpdateAsync(setter =>
            {
                setter.SetProperty(x => x.RefreshToken, refreshToken);
                setter.SetProperty(x => x.RefreshTokenExpiryDate, expiryDatetime);
            });
    }

    public async Task<User> GetUserByGoogleId (string googleId)
    {
        return await dbContext.User
            .Where(u => u.GoogleId.Equals(googleId))
            .FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByRefreshToken(string refreshToken)
    {
        return await dbContext.User
            .Where(u => u.RefreshToken.Equals(refreshToken))
            .FirstAsync();
    }

    public async Task<ClientUserField> GetUserClientFieldByGoogleId (string googleId)
    {
         User user = await GetUserByGoogleId(googleId);
         
         return user == null ? null : user.GetClientUserField();
    }
    
    public async Task<int> DeleteUserByGoogleId (string googleId) {
        return await dbContext.User
            .Where(x => x.GoogleId.Equals(googleId))
            .ExecuteDeleteAsync();
    }
}