namespace quiz_me_server.code.dto.auth;

public class GoogleTokenDTO
{
    public string access_token { set; get;  }
    public string id_token { set; get;  }
    
    public string refresh_token { set; get;  }
    
}