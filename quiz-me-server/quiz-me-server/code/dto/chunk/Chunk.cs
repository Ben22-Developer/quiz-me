namespace quiz_me_server.code.dto.chunk;

public class Chunk(int skip, int take)
{
    public Chunk() : this(0, 0)
    {
    }

    public int Skip { get; set; } = skip;
    public int Take { get; set; } = take;
}