namespace quiz_me_server.code.dto.user;

public class UserMark
{
    public long Id { set; get; }
    
    public User User { set; get; }
    
    public double Marks { set; get; } 
}