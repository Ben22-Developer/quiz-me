using quiz_me_server.code.dto.chunk;

namespace quiz_me_server.code.service.chunk_service;

public class ChunkService
{
    public void SetNextChunk (int totalListCount, int currentChunkCount, int requiredChunkCount, Chunk chunk)
    {
        bool areRequiredQuestionRetrieved = totalListCount >= requiredChunkCount;

        chunk.Skip = areRequiredQuestionRetrieved ? currentChunkCount + chunk.Skip : 0;
        
        chunk.Take = areRequiredQuestionRetrieved ? requiredChunkCount : requiredChunkCount - totalListCount;
    }
}