using quiz_me_server.code.dto.chunk;
using quiz_me_server.code.dto.question_answer.db_model;

namespace quiz_me_server.code.repository.contract;

public interface IQuestionRepositoryContract
{
    Task<int> CreateQuestion(List<Question> models);
    Task<int> UpdateQuestion(List<Question> model);
    Task<List<Question>> ReadQuestionByChunk(Chunk chunk);
    Task<List<Question>> ReadQuestionByIds(HashSet<long> ids);
    Task<List<Question>> ReadQuestionByShuffle(Chunk chunk);
    Task<Dictionary<long, long>> ReadQuestionTrueAnswerId(HashSet<long> questionId);
    Task<int> DeleteQuestion(HashSet<long> ids);   
}