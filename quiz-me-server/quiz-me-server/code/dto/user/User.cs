using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace quiz_me_server.code.dto.user;

[Index(nameof(GoogleId), IsUnique=true), Index(nameof(Username), IsUnique = true)]
public class User
{
    public long Id { set; get; }
    
    [Required]
    public string GoogleId { set; get;  }

    [Required]
    public string Username { set; get; }
    
    [Required]
    public string Name { set; get; }
    
    [Required]
    public string ProfilePictureUrl { set; get; }
    
    [Required]
    public string RefreshToken { set; get; }
    
    [Required]
    public DateTime RefreshTokenExpiryDate { set; get; }
    
    public ClientUserField GetClientUserField ()
    {
        return new ClientUserField
        {
            GoogleId = this.GoogleId,
            Username = this.Username,
            Name = this.Name,
            ProfilePictureUrl = this.ProfilePictureUrl
        };
    }
}