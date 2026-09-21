using System.ComponentModel.DataAnnotations;

namespace quiz_me_server.code.dto.user;

public class ClientUserField
{
        
        [Required]
        public string GoogleId { set; get;  }
    
        [Required]
        public string Username { set; get; }
        
        [Required]
        public string Name { set; get; }
        
        [Required]
        public string ProfilePictureUrl { set; get; }
        
        public bool IsClientFieldSame (ClientUserField user)
        {
                return this.Name.Equals(user.Name) &&
                       this.Username.Equals(user.Username) &&
                       this.ProfilePictureUrl.Equals(user.ProfilePictureUrl);
        }
}